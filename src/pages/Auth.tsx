import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, authPersistenceReady } from "@/integrations/firebase/client";
import { requestVerificationEmail, requestPasswordResetEmail } from "@/services/authEmailService";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Linkedin } from "lucide-react";
import AuthShell from "@/components/AuthShell";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "LINKEDIN_AUTH_CODE") {
        const { code, error } = event.data;
        if (error) {
          toast.error(`LinkedIn Auth Error: ${error}`);
          return;
        }
        if (code) {
          try {
            setLoading(true);
            const { httpsCallable } = await import("firebase/functions");
            const { signInWithCustomToken } = await import("firebase/auth");
            const { auth, functions } = await import("@/integrations/firebase/client");
            const fn = httpsCallable(functions, "exchangeLinkedInCode");
            const redirectUri = window.location.origin + "/auth/linkedin/callback";
            const res: any = await fn({ code, redirectUri });
            if (res.data?.customToken) {
              await signInWithCustomToken(auth, res.data.customToken);
              toast.success(`Welcome, ${res.data.profile?.name || "User"}! Logged in via LinkedIn.`);
              navigate("/dashboard");
            } else if (res.data?.profile) {
              toast.success(`Welcome, ${res.data.profile.name}!`);
              navigate("/dashboard");
            }
          } catch (err: any) {
            toast.error(err.message || "LinkedIn login failed");
          } finally {
            setLoading(false);
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  const handleLinkedInLogin = () => {
    const clientId = "86mup2dj0eqm14";
    const redirectUri = window.location.origin + "/auth/linkedin/callback";
    const scope = "openid profile email";
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem("linkedin_oauth_state", state);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    const width = 600;
    const height = 650;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    window.open(authUrl, "LinkedInAuth", `width=${width},height=${height},top=${top},left=${left}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authPersistenceReady;

      if (isLogin) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        if (!user.emailVerified) {
          toast.info("Please verify your email before opening the dashboard.");
          navigate("/verify-email");
          return;
        }
        toast.success("Welcome back!");

        const isCampus = typeof window !== "undefined" && (
          window.location.hostname.includes("campus") ||
          window.location.hostname.includes("isolation-staging")
        );

        if (isCampus) {
          try {
            const idToken = await user.getIdTokenResult(true);
            const lowerEmail = (user.email || "").toLowerCase();
            if (
              idToken.claims.role === "platform_admin" ||
              lowerEmail === "abhi.triloki@gmail.com" ||
              lowerEmail === "abhitriloki@gmail.com"
            ) {
              navigate("/platform-admin");
              return;
            }
            if (idToken.claims.role === "student") {
              navigate("/campus/student-drives");
              return;
            }
          } catch {}
          navigate("/campus");
        } else {
          navigate("/dashboard");
        }
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName.trim()) {
          await updateProfile(user, { displayName: fullName.trim() });
        }

        try {
          await requestVerificationEmail(user, email);
          toast.success("Account created. Verification email sent via Zoho!");
        } catch (emailError) {
          console.error("Error sending verification email:", emailError);
        }

        navigate("/verify-email");
      }
    } catch (error: any) {
      const msg =
        error.code === "auth/invalid-credential" ? "Invalid email or password" :
        error.code === "auth/email-already-in-use" ? "Email already in use" :
        error.code === "auth/weak-password" ? "Password must be at least 6 characters" :
        error.message || "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authPersistenceReady;

      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      if (!user.emailVerified) {
        toast.info("Please verify your email before opening the dashboard.");
        navigate("/verify-email");
        return;
      }
      toast.success("Welcome back!");

      const isCampus = typeof window !== "undefined" && (
        window.location.hostname.includes("campus") ||
        window.location.hostname.includes("isolation-staging")
      );

      if (isCampus) {
        try {
          const idToken = await user.getIdTokenResult(true);
          const lowerEmail = (user.email || "").toLowerCase();
          if (
            idToken.claims.role === "platform_admin" ||
            lowerEmail === "abhi.triloki@gmail.com" ||
            lowerEmail === "abhitriloki@gmail.com"
          ) {
            navigate("/platform-admin");
            return;
          }
          if (idToken.claims.role === "student") {
            navigate("/campus/student-drives");
            return;
          }
        } catch {}
        navigate("/campus");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    setLoading(true);
    try {
      await authPersistenceReady;
      await requestPasswordResetEmail(email);
      toast.success("Password reset email sent to your inbox!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow={isLogin ? "Welcome back" : "Create your account"}
      title={isLogin ? "Continue your career momentum." : "Start building a sharper career profile."}
      description={
        isLogin
          ? "Sign in to access your resume workbench, job-fit insights, and saved career intelligence."
          : "Create your account to unlock Resume Studio, Job Fit Analysis, and a more strategic application workflow."
      }
      rightTitle="Resume fit. Job fit. One connected entry point."
      rightSubtitle="The new AIVI experience begins with a premium, focused workspace that keeps resume creation and job alignment in one system."
      metricLabel="Career readiness view"
      metricValue="88%"
      metricCaption="Professionals typically see stronger resume clarity after moving through the guided AIVI workflow."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 text-sm">
          <Link to="/" className="font-medium text-[#169C8F] transition-colors hover:text-[#112031]">
            Back to Home
          </Link>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-[#FF6D4A] transition-colors hover:text-[#112031]"
          >
            {isLogin ? "Create account" : "Sign in instead"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#112031]">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8C96]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required={!isLogin}
                  className="w-full rounded-2xl border border-[#DFE7E9] bg-[#FBFCFC] pl-11 pr-4 py-3 text-sm text-[#112031] placeholder:text-[#8A97A1] shadow-[0_8px_24px_-20px_rgba(17,32,49,0.16)] outline-none transition-all focus:border-[#99D8D0] focus:bg-white focus:ring-4 focus:ring-[#57CEC2]/12"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#112031]">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8C96]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-2xl border border-[#DFE7E9] bg-[#FBFCFC] pl-11 pr-4 py-3 text-sm text-[#112031] placeholder:text-[#8A97A1] shadow-[0_8px_24px_-20px_rgba(17,32,49,0.16)] outline-none transition-all focus:border-[#99D8D0] focus:bg-white focus:ring-4 focus:ring-[#57CEC2]/12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#112031]">Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-[#169C8F] transition-colors hover:text-[#112031]"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8C96]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-2xl border border-[#DFE7E9] bg-[#FBFCFC] pl-11 pr-12 py-3 text-sm text-[#112031] placeholder:text-[#8A97A1] shadow-[0_8px_24px_-20px_rgba(17,32,49,0.16)] outline-none transition-all focus:border-[#99D8D0] focus:bg-white focus:ring-4 focus:ring-[#57CEC2]/12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C8C96] transition-colors hover:text-[#112031]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#FF6D4A] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_22px_56px_-24px_rgba(255,109,74,0.48)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:translate-y-0 disabled:opacity-60"
          >
            {loading ? "Loading..." : isLogin ? "Enter AIVI" : "Create Account"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#E5EBED]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-[0.18em]">
            <span className="bg-white px-3 text-[#86939D]">Or continue with</span>
          </div>
        </div>

        <div className="w-full">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-[#DFE7E9] bg-white px-4 py-3 text-sm font-semibold text-[#112031] shadow-[0_10px_24px_-20px_rgba(17,32,49,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C7D8DD] hover:bg-[#FBFCFC]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-[#74818B]">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-[#FF6D4A] transition-colors hover:text-[#112031]">
            {isLogin ? "Create your account" : "Sign in"}
          </button>
        </p>
      </div>
    </AuthShell>
  );
};

export default Auth;
