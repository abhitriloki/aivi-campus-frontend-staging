import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { httpsCallable } from "firebase/functions";
import {
  AlertCircle,
  ArrowUpRight,
  AtSign,
  CalendarClock,
  CheckCircle,
  FileText,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  User,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { functions } from "@/integrations/firebase/client";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const trustPoints = [
  {
    icon: Zap,
    tile: "border-[#dbeafe] bg-[#eff6ff] text-[#2563eb]",
    title: "Quick Response",
    text: "We walk through YOUR roster, AES dashboard, a live drive shortlist and one NAAC export",
  },
  {
    icon: Users,
    tile: "border-[#f3e8ff] bg-[#faf5ff] text-[#9333ea]",
    title: "Talk to Experts",
    text: "TPO, Placement Director, Principal or your faculty coordinator — whoever owns outcomes.",
  },
  {
    icon: ShieldCheck,
    tile: "border-[#d1fae5] bg-[#ecfdf5] text-[#059669]",
    title: "Trusted & Secure",
    text: "DPDP Act 2023 aligned · hosted in India · no spam, demo follow-ups only.",
  },
];

const contactCards = [
  {
    icon: Mail,
    tile: "bg-[#dbeafe] text-[#2563eb]",
    label: "Email",
    value: "hello@campusos.com",
    href: "mailto:hello@campusos.com",
    external: true,
    arrow: false,
    desc: "Drop us an email anytime.",
  },
  {
    icon: Phone,
    tile: "bg-[#dbeafe] text-[#2563eb]",
    label: "Call Us",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    external: true,
    arrow: false,
    desc: "Mon – Fri, 9AM – 6PM",
  },
  {
    icon: MessageCircle,
    tile: "bg-[#d1fae5] text-[#059669]",
    label: "WhatsApp",
    value: "+91 98765 43210",
    href: "https://wa.me/919876543210",
    external: true,
    arrow: false,
    desc: "Quick questions? Chat with us.",
  },
  {
    icon: CalendarClock,
    tile: "bg-[#f3e8ff] text-[#9333ea]",
    label: "Schedule a Demo",
    value: "Book a 20-min call",
    href: "/#demo",
    external: false,
    arrow: true,
    desc: "See CampusOS in action.",
  },
];

const fields = [
  { name: "name", label: "Full name", icon: User, type: "text", placeholder: "Dr. Meera Krishnan" },
  { name: "email", label: "Work email", icon: AtSign, type: "email", placeholder: "you@college.edu.in" },
  { name: "subject", label: "Subject", icon: FileText, type: "text", placeholder: "What is this about?" },
] as const;

const inputClass =
  "h-[38px] w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-2 pl-10 pr-3.5 text-xs text-[#1e293b] shadow-[0_1px_2px_rgba(0,0,0,0.05)] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20";

const PageGlow = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0">
    <div className="absolute -top-32 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(239,246,255,0.95),transparent)]" />
    <div className="absolute right-[6%] top-[28%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(224,242,254,0.8),transparent)]" />
    <div className="absolute left-[4%] top-[58%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(219,234,254,0.7),transparent)]" />
  </div>
);

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
      <div className="min-h-screen bg-white font-sans">
        <GlobalHeader />
        <main className="relative overflow-hidden bg-[#f8fafc]">
          <PageGlow />
          <div className="relative mx-auto max-w-[1240px] px-6 py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-2xl rounded-[32px] border border-[#f1f5f9] bg-white p-10 text-center shadow-[0_8px_10px_rgba(226,232,240,0.6),0_20px_25px_rgba(226,232,240,0.6)]"
            >
              <CheckCircle className="mx-auto h-16 w-16 text-[#2563eb]" />
              <h2 className="mt-5 text-[26px] font-bold leading-8 tracking-[-0.65px] text-[#0f172a]">
                Thanks for reaching out
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#64748b]">
                Your message has been received. We’ll get back to {form.email} as soon as possible.
              </p>
            </motion.div>
          </div>
        </main>
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <GlobalHeader />
      <main className="relative overflow-hidden bg-[#f8fafc]">
        <PageGlow />
        <div className="relative mx-auto max-w-[1240px] px-6 pb-20 pt-[60px]">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-4xl font-bold leading-tight text-[#1769ff] sm:text-5xl lg:text-[64px] lg:leading-[80px]"
          >
            Contact US
          </motion.h1>

          <div className="mx-auto mt-8 grid max-w-[1184px] gap-10 lg:grid-cols-[minmax(0,674px)_minmax(0,470px)] lg:justify-center">
            {/* LEFT — hero + trust + other ways */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-4xl font-extrabold leading-[1.15] tracking-[-1.35px] text-[#0f172a] sm:text-5xl lg:text-[48px] lg:leading-[54px]">
                We set the demo up with your college&apos;s sample data
              </h2>
              <p className="mt-4 max-w-[576px] text-[18px] leading-[28px] text-[#475569]">
                Have questions, need a demo, or want to partner with us? Our team is here to help you
                get started with CampusOS.
              </p>

              <div className="mt-8 space-y-4">
                {trustPoints.map((point) => (
                  <div key={point.title} className="flex items-center gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${point.tile}`}
                    >
                      <point.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0f172a]">{point.title}</p>
                      <p className="mt-0.5 text-xs leading-4 text-[#64748b]">{point.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-[24px] border border-[#e2e8f0] bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <h3 className="text-base font-bold text-[#0f172a]">Other ways to reach us</h3>
                <div className="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
                  {contactCards.map((card) => (
                    <div
                      key={card.label}
                      className="rounded-2xl border border-[#f1f5f9] bg-[#f8fafc] p-3.5"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.tile}`}
                      >
                        <card.icon className="h-4 w-4" />
                      </div>
                      <p className="mt-3 text-xs font-medium text-[#64748b]">{card.label}</p>
                      {card.arrow ? (
                        <Link
                          to={card.href}
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline"
                        >
                          {card.value}
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      ) : (
                        <a
                          href={card.href}
                          className="mt-1 block break-all text-xs font-semibold text-[#2563eb] hover:underline"
                        >
                          {card.value}
                        </a>
                      )}
                      <p className="mt-1.5 text-[11px] leading-[16.5px] text-[#94a3b8]">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT — form card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="h-fit rounded-[32px] border border-[#f1f5f9] bg-white p-6 shadow-[0_8px_10px_rgba(226,232,240,0.6),0_20px_25px_rgba(226,232,240,0.6)] sm:p-9"
            >
              <h2 className="text-[26px] font-bold leading-8 tracking-[-0.65px] text-[#0f172a]">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-[22.8px] text-[#64748b]">
                Tell us about your institution or requirement and our team will get back to you.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label htmlFor={field.name} className="text-xs font-semibold text-[#334155]">
                      {field.label} *
                    </label>
                    <div className="relative">
                      <field.icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={inputClass}
                      />
                    </div>
                    {errors[field.name] && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" /> {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-[#334155]">
                    Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#94a3b8]" />
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Tell us about your placement cell, batch size, current tools..."
                      className="min-h-[70px] w-full resize-none rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-2.5 pl-10 pr-3.5 text-xs text-[#1e293b] shadow-[0_1px_2px_rgba(0,0,0,0.05)] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                    />
                  </div>
                  {errors.message && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] px-6 text-sm font-semibold text-white shadow-[0_2px_4px_rgba(59,130,246,0.3),0_4px_6px_rgba(59,130,246,0.3)] transition-all duration-300 hover:bg-[#1d4ed8] disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <Send className="h-4 w-4" />}
                </button>
                <p className="text-center text-[11px] leading-[16.5px] text-[#94a3b8]">
                  By submitting, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
};

export default ContactConceptB;
