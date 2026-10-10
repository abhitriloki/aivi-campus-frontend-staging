import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { getAuthInstance, authPersistenceReady } from "@/integrations/firebase/client";
import {
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Lock,
  ArrowRight,
  KeyRound,
  Eye,
  EyeOff,
  Mail,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import CampusLogo from "@/components/CampusLogo";
import { requestPasswordResetEmail } from "@/services/authEmailService";
import { toast } from "sonner";

export default function AuthAction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const continueUrl = searchParams.get("continueUrl");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "reset_form">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  // Password reset form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // Self-service link recovery state
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  useEffect(() => {
    if (!oobCode || !mode) {
      setStatus("error");
      setErrorMessage("Invalid or missing verification code in link.");
      return;
    }

    const processAction = async () => {
      await authPersistenceReady;
      const auth = getAuthInstance();

      try {
        switch (mode) {
          case "verifyEmail": {
            await applyActionCode(auth, oobCode);
            if (auth.currentUser) {
              await auth.currentUser.reload();
            }
            setStatus("success");
            toast.success("Email verified successfully!");
            break;
          }

          case "resetPassword": {
            const email = await verifyPasswordResetCode(auth, oobCode);
            setUserEmail(email);
            setResendEmail(email);
            setStatus("reset_form");
            break;
          }

          case "recoverEmail": {
            await applyActionCode(auth, oobCode);
            setStatus("success");
            toast.success("Email recovered successfully!");
            break;
          }

          default: {
            setStatus("error");
            setErrorMessage(`Unsupported authentication action: ${mode}`);
          }
        }
      } catch (err: any) {
        console.error("Auth action error:", err);
        setStatus("error");
        if (err.code === "auth/invalid-action-code") {
          setErrorMessage("This verification link has expired or has already been used.");
        } else if (err.code === "auth/expired-action-code") {
          setErrorMessage("This link has expired. Please request a new verification email.");
        } else if (err.code === "auth/user-disabled") {
          setErrorMessage("This account has been disabled. Please contact support.");
        } else {
          setErrorMessage(err.message || "Failed to process authentication action.");
        }
      }
    };

    processAction();
  }, [mode, oobCode]);

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmittingPassword(true);
    try {
      if (!oobCode) throw new Error("Missing reset code.");
      const auth = getAuthInstance();
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus("success");
      toast.success("Password updated successfully! Please sign in to your placement portal.");
    } catch (err: any) {
      console.error("Confirm password reset error:", err);
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setSubmittingPassword(false);
    }
  };

  const handleRequestFreshLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = resendEmail.trim();
    if (!target) {
      toast.error("Please enter your registered institutional email.");
      return;
    }
    setIsResending(true);
    try {
      await requestPasswordResetEmail(target);
      setResendDone(true);
      toast.success(`A fresh password setup link has been sent to ${target}. Check your inbox.`);
    } catch (err: any) {
      toast.error(err.message || "Could not dispatch new reset link. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleProceedToLogin = () => {
    if (continueUrl) {
      try {
        const parsed = new URL(continueUrl, window.location.origin);
        if (parsed.origin === window.location.origin) {
          navigate(parsed.pathname + parsed.search);
          return;
        }
        window.location.assign(continueUrl);
        return;
      } catch {
        navigate(continueUrl);
        return;
      }
    }
    navigate("/campus/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F1720] text-slate-100 flex flex-col justify-between">
      {/* ambient glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-52 top-[-160px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,hsl(177_51%_36%/0.4),transparent)] blur-2xl" />
        <div className="absolute bottom-[-220px] right-[-120px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,hsl(177_51%_38%/0.22),transparent)] blur-2xl" />
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,hsl(0_0%_100%/0.035)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.035)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_20%,black,transparent)]" />
      </div>

      {/* Header bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <CampusLogo onDark className="h-11 w-[170px]" imgClassName="h-9 w-full" />
        </Link>
        <Link
          to="/campus/login"
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12.5px] font-bold text-slate-300 backdrop-blur transition hover:border-white/25 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Campus Login
        </Link>
      </header>

      {/* Main card */}
      <main className="relative z-10 mx-auto w-full max-w-lg px-4 py-8">
        <div className="rounded-[2rem] border border-white/10 bg-[#101820]/95 p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(176_52%_45%/0.3)] bg-[hsl(176_52%_45%/0.08)] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[hsl(176_52%_62%)]">
              <ShieldCheck className="h-3.5 w-3.5" /> Institutional Security Gateway
            </span>
          </div>

          {/* LOADING STATE */}
          {status === "loading" && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(176_52%_45%/0.12)] text-[hsl(176_52%_55%)] shadow-inner">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-white">Validating Security Token…</h2>
              <p className="text-sm text-slate-400">
                Please wait while we verify your cryptographic authentication code.
              </p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {status === "success" && (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
                <CheckCircle className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {mode === "resetPassword" ? "Password Updated Successfully!" : "Email Verified!"}
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                {mode === "resetPassword"
                  ? "Your credentials have been securely updated. You can now log into your institutional campus portal."
                  : "Your campus account is now verified and active. You can now proceed to sign in."}
              </p>

              <div className="pt-4">
                <button
                  onClick={handleProceedToLogin}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(180deg,hsl(176_52%_46%),hsl(178_58%_29%))] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[hsl(176_52%_44%/0.3)] transition hover:brightness-110"
                >
                  <span>Proceed to Campus Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* RESET PASSWORD FORM */}
          {status === "reset_form" && (
            <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(176_52%_45%/0.15)] text-[hsl(176_52%_55%)] mb-2">
                <Lock className="h-6 w-6" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Set New Password</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a secure password for <strong className="text-slate-200">{userEmail}</strong>
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-white/10 bg-[#0F1720] px-4 py-3 pr-11 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-[hsl(176_52%_50%)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                    title={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border border-white/10 bg-[#0F1720] px-4 py-3 pr-11 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-[hsl(176_52%_50%)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingPassword}
                className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(180deg,hsl(176_52%_46%),hsl(178_58%_29%))] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[hsl(176_52%_44%/0.3)] transition hover:brightness-110 disabled:opacity-60 cursor-pointer"
              >
                {submittingPassword ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Saving Password…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Save New Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* ERROR STATE & INSTANT RECOVERY */}
          {status === "error" && (
            <div className="text-center py-2 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Verification Link Issue</h2>
              <p className="text-sm leading-relaxed text-slate-300">
                {errorMessage}
              </p>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-left text-xs text-amber-200/90 leading-relaxed">
                <strong>Why did this happen?</strong>
                <p className="mt-1 text-[11.5px] text-amber-200/80">
                  Firebase one-time security codes expire after single use, or if "Forgot Password" was requested multiple times (which automatically invalidates older links in your email).
                </p>
              </div>

              {/* Self-Service Instant Fresh Link Generator */}
              <div className="mt-4 rounded-xl border border-white/10 bg-[#0F1720]/80 p-4 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <KeyRound className="h-4 w-4 text-[hsl(176_52%_60%)]" />
                  <span>Request a Fresh Reset Link</span>
                </div>
                {resendDone ? (
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>A fresh reset link was dispatched! Please open your newest email to reset your password.</span>
                  </div>
                ) : (
                  <form onSubmit={handleRequestFreshLink} className="space-y-2.5">
                    <input
                      type="email"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="Enter your student/TPO email"
                      className="w-full rounded-lg border border-white/10 bg-[#16212E] px-3.5 py-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:border-[hsl(176_52%_50%)] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isResending}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-[hsl(176_52%_46%)] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[hsl(176_52%_40%)] disabled:opacity-50 cursor-pointer"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Sending Link…
                        </>
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5" /> Send Fresh Reset Link
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleProceedToLogin}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                >
                  <span>Go to Campus Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 px-6 py-6 text-center text-xs text-slate-500">
        <span>AIVI Campus OS · Sovereign Placement & Accreditation Intelligence</span>
      </footer>
    </div>
  );
}
