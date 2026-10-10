import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { httpsCallable } from "firebase/functions";
import { AlertCircle, CheckCircle, Mail, Send } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { CtaPanel, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";
import { functions } from "@/integrations/firebase/client";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const ContactConceptB = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastSubmit = useRef(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Date.now() - lastSubmit.current < 30000) {
      toast.error("Please wait before submitting again.");
      return;
    }

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    lastSubmit.current = Date.now();

    try {
      const submitFn = httpsCallable(functions, "submitContactForm");
      await submitFn({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });

      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error: any) {
      console.error("Contact submit error:", error);
      toast.error(error.message || "Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalHeader />
        <PublicPageShell
          eyebrow="Message Sent"
          title={<>Thanks for reaching out</>}
          description={`We’ll get back to ${form.email} as soon as possible.`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-2xl rounded-[2rem] border border-[#E7ECEF] bg-white p-10 text-center shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          >
            <CheckCircle className="mx-auto h-16 w-16 text-[#19A89A]" />
            <p className="mt-5 text-base leading-8 text-[#61707B]">
              Your message has been received. We’ll respond with the right next step instead of a generic autoresponder.
            </p>
          </motion.div>
        </PublicPageShell>
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />
      <PublicPageShell
        eyebrow="Contact"
        title={<>Talk to the team behind AIVI</>}
        description="Whether it is product feedback, partnerships, or investor conversation, use the form below and we’ll route it properly."
      >
        <SectionBlock
          title="Send us a message"
          description="The contact flow is still backed by the same Firebase callable function. This redesign only improves the presentation layer."
        >
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] border border-[#E7ECEF] bg-white p-8 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {(["name", "email", "subject"] as const).map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium capitalize text-[#112031]">{field}</label>
                    <input
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={field === "email" ? "you@example.com" : `Your ${field}`}
                      className="w-full rounded-2xl border border-[#DEE6EA] bg-[#FCFEFE] px-4 py-3 text-sm text-[#112031] placeholder:text-[#8A97A1] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                    />
                    {errors[field] && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" /> {errors[field]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#112031]">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="How can we help?"
                    className="w-full resize-none rounded-2xl border border-[#DEE6EA] bg-[#FCFEFE] px-4 py-3 text-sm text-[#112031] placeholder:text-[#8A97A1] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                  />
                  {errors.message && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_48px_-24px_rgba(255,109,74,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <Send className="h-4 w-4" />}
                </button>
              </form>
            </motion.div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-[#DDF0ED] bg-[linear-gradient(180deg,#F7FFFD_0%,#EEFBF8_100%)] p-8 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
                <div className="inline-flex rounded-2xl bg-white p-3 text-[#19A89A] shadow-[0_12px_28px_-22px_rgba(17,32,49,0.16)]">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#112031]">Direct email</h3>
                <a href="mailto:hello@aivilabs.com" className="mt-3 block text-base font-medium text-[#19A89A] hover:underline">
                  hello@aivilabs.com
                </a>
                <p className="mt-4 text-sm leading-7 text-[#61707B]">
                  Best for partnerships, founder conversations, and product feedback that needs a direct response.
                </p>
              </div>
            </div>
          </div>
        </SectionBlock>

        <CtaPanel
          title="Want to see the product before writing to us?"
          text="If your question is about how AIVI helps with resumes, job fit, or interview preparation, the fastest answer is usually inside the product experience itself."
          primaryLabel="Explore AIVI"
          primaryTo="/dashboard"
          secondaryLabel="See Pricing"
          secondaryTo="/#pricing"
        />
      </PublicPageShell>
      <GlobalFooter />
    </div>
  );
};

export default ContactConceptB;
