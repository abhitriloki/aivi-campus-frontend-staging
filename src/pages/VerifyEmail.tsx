import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/integrations/firebase/client";
import { reload } from "firebase/auth";
import { requestVerificationEmail } from "@/services/authEmailService";
import { toast } from "sonner";
import { Mail, RefreshCw, CheckCircle, ArrowRight } from "lucide-react";
import AuthShell from "@/components/AuthShell";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/auth");
        return;
      }
      setEmail(user.email);
      if (user.emailVerified) {
        navigate("/dashboard");
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      await requestVerificationEmail(user, email || user.email || undefined);
      toast.success("Verification email sent via Zoho! Please check your inbox.");
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please wait a few minutes before trying again.");
      } else {
        toast.error(error.message || "Failed to send verification email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      await reload(user);
      if (user.emailVerified) {
        toast.success("Email verified! Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        toast.error("Email not yet verified. Please check your inbox and click the link.");
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      toast.error("Failed to check status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Verify your email"
      title="One final step before you enter AIVI."
      description="We’ve already created your account. Verify your email to unlock the dashboard and continue your career intelligence workflow."
      rightTitle="Verification keeps the workspace secure."
      rightSubtitle="A quick inbox confirmation protects account access and keeps your saved resume, analysis, and career data tied to the right identity."
      metricLabel="Access status"
      metricValue="1/1"
      metricCaption="Complete email verification to activate the full dashboard experience."
    >
      <div className="space-y-6">
        <div className="rounded-[1.7rem] border border-[#E4ECEA] bg-[linear-gradient(180deg,#FFFDF9_0%,#F8FCFC_100%)] p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFFBFA] text-[#1BAA9D] shadow-[0_16px_36px_-24px_rgba(27,170,157,0.28)]">
            <Mail className="h-8 w-8" />
          </div>

          <h1 className="mt-5 text-center text-2xl font-bold tracking-[-0.03em] text-[#112031]">Check your email</h1>
          <p className="mt-3 text-center text-sm leading-7 text-[#5D6C79]">
            We’ve sent a verification link to{" "}
            <span className="font-semibold text-[#112031]">{email}</span>.
            Verify your email to access the dashboard.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleCheckVerification}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_22px_56px_-24px_rgba(255,109,74,0.48)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:translate-y-0 disabled:opacity-60"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              I’ve Verified My Email
            </button>

            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full rounded-2xl border border-[#DFE7E9] bg-white px-5 py-3.5 text-sm font-semibold text-[#112031] shadow-[0_10px_24px_-20px_rgba(17,32,49,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C7D8DD] hover:bg-[#FBFCFC] disabled:translate-y-0 disabled:opacity-60"
            >
              Resend Verification Email
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-[#74818B]">
          <Link to="/auth" className="inline-flex items-center gap-1 font-medium text-[#169C8F] transition-colors hover:text-[#112031]">
            Back to Sign In
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <span>Secure, encrypted, and account-linked.</span>
        </div>
      </div>
    </AuthShell>
  );
};

export default VerifyEmail;
