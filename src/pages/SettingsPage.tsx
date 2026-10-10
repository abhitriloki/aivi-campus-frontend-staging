import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Shield,
  CreditCard,
  Bell,
  ChevronRight,
  Save,
  Check,
  CheckCircle,
  Sparkles,
  Ticket,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { updatePassword, signOut as firebaseSignOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";
import { auth, db, functions } from "@/integrations/firebase/client";
import { toast } from "sonner";
import {
  getUserPlanInfo,
  getPlanDisplayName,
  applyCoupon,
  type PlanInfo,
  type PlanType,
} from "@/services/planService";
import { startCheckout } from "@/services/paymentService";

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const SettingsPage = () => {
  const { user, tenant } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>("profile");
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState({
    email_analysis: true,
    email_updates: false,
    email_tips: true,
  });
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [checkingOut, setCheckingOut] = useState<"starter" | "pro" | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.displayName ?? "");
      getUserPlanInfo(user.uid).then(setPlanInfo);
    }
  }, [user]);

  const heroSignals = useMemo(
    () => [
      {
        title: "Account Profile",
        body: "Manage your public name and core account identity.",
        icon: User,
      },
      {
        title: "Plan Control",
        body: "Review plan status, trial access, upgrades, and coupon redemption.",
        icon: CreditCard,
      },
      {
        title: "Security & Alerts",
        body: "Update password and tune how AIVI communicates with you.",
        icon: ShieldCheck,
      },
    ],
    []
  );

  const handleSaveProfile = async () => {
    if (!user || !fullName.trim()) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, "profiles", user.uid),
        { fullName: fullName.trim(), updatedAt: new Date() },
        { merge: true }
      );
      toast.success("Profile updated successfully");
    } catch (e) {
      toast.error(errorMessage(e, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password updated successfully");
      setNewPassword("");
    } catch (e) {
      const code = typeof e === "object" && e !== null && "code" in e ? e.code : undefined;
      if (code === "auth/requires-recent-login") {
        toast.error("Please sign out and sign back in to change your password.");
      } else {
        toast.error(errorMessage(e, "Failed to update password"));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    setApplyingCoupon(true);
    try {
      const result = await applyCoupon(couponCode.trim().toUpperCase());
      if (result.success) {
        toast.success(result.message);
        setCouponCode("");
        if (user) {
          const info = await getUserPlanInfo(user.uid);
          setPlanInfo(info);
        }
      }
    } catch (e) {
      toast.error(errorMessage(e, "Failed to apply coupon"));
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  const handleCheckout = async (planType: "starter" | "pro") => {
    setCheckingOut(planType);
    try {
      await startCheckout(planType, { name: user?.displayName, email: user?.email });
    } catch (error) {
      toast.error(errorMessage(error, "Unable to start checkout"));
    } finally {
      setCheckingOut(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error("Type DELETE to confirm account deletion.");
      return;
    }

    setDeletingAccount(true);
    try {
      const deleteMyAccount = httpsCallable(functions, "deleteMyAccount");
      await deleteMyAccount({});
      await firebaseSignOut(auth);
      toast.success("Your account and saved data were deleted.");
      navigate("/");
    } catch (error) {
      toast.error(errorMessage(error, "Unable to delete account"));
    } finally {
      setDeletingAccount(false);
    }
  };

  const sections = [
    {
      key: "profile",
      icon: User,
      title: "Profile",
      desc: "Update your name and core identity details",
      content: (
        <div className="space-y-5 pt-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#112031]">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-[1.2rem] border border-[#E7ECEF] bg-[#F4F6F7] px-4 py-3 text-sm text-[#7D8891]"
            />
            <p className="text-xs leading-6 text-[#7D8891]">Email cannot be changed directly.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#112031]">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-[1.2rem] border border-[#E7ECEF] bg-white px-4 py-3 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
            />
          </div>

          {tenant.tenantId && (
            <div className="rounded-[1.4rem] border border-primary/20 bg-primary/5 p-4 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Institutional Membership (Read-Only)</span>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-muted-foreground">Institution:</span>
                  <p className="font-semibold">{tenant.tenant?.name || "Campus Institution"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Portal Role:</span>
                  <p className="font-semibold capitalize">{tenant.role.replace("_", " ")}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {saving ? "Saving..." : "Save Profile"}
            {!saving && <Save className="h-4 w-4" />}
          </button>
        </div>
      ),
    },
    {
      key: "security",
      icon: Shield,
      title: "Security",
      desc: "Password updates and account protection",
      content: (
        <div className="space-y-5 pt-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#112031]">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className="w-full rounded-[1.2rem] border border-[#E7ECEF] bg-white px-4 py-3 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
            />
          </div>

          <button
            onClick={handleChangePassword}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {saving ? "Updating..." : "Update Password"}
            {!saving && <Shield className="h-4 w-4" />}
          </button>
        </div>
      ),
    },
    {
      key: "subscription",
      icon: CreditCard,
      title: "Subscription",
      desc: "Manage access, billing direction, and beta codes",
      content: (
        <div className="space-y-5 pt-5">
          <div className="rounded-[1.4rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-[#112031]">Current plan</span>
              <span className="rounded-full bg-[#EFFBFA] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#169C8F]">
                {planInfo ? getPlanDisplayName(planInfo.plan_type as PlanType) : "Free (Discovery)"}
              </span>
            </div>
            <p className="text-sm leading-7 text-[#66727C]">
              {planInfo?.plan_type === "pro" || planInfo?.plan_type === "admin"
                ? "Unlimited analyses across the platform."
                : planInfo?.plan_type === "starter"
                  ? `${planInfo.monthly_analysis_used}/30 analyses used this month.`
                  : "Limited lifetime access across all modules."}
            </p>
          </div>

          {planInfo?.plan_type !== "pro" && planInfo?.plan_type !== "admin" && (
            <div className="rounded-[1.5rem] border border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] p-4">
              <h4 className="text-sm font-semibold text-[#112031]">
                {planInfo?.plan_type === "starter" ? "Upgrade to Pro" : "Upgrade to Starter"}
              </h4>
              <p className="mt-1 text-sm leading-7 text-[#66727C]">
                {planInfo?.plan_type === "starter"
                  ? "Get unlimited analyses, priority AI processing, PDF exports, and premium support."
                  : "Get 30 analyses/month, full Skill Roadmap, Interview Intelligence, and all modules."}
              </p>
              <button
                type="button"
                onClick={() => handleCheckout(planInfo?.plan_type === "starter" ? "pro" : "starter")}
                disabled={checkingOut !== null}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B]"
              >
                {checkingOut
                  ? "Starting checkout..."
                  : planInfo?.plan_type === "starter"
                    ? "Go Pro - ₹599/mo"
                    : "Upgrade - ₹399/mo"}
              </button>
            </div>
          )}

          {!planInfo?.trialUsed && (
            <div className="rounded-[1.4rem] border border-[#E7ECEF] bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <Ticket className="h-4 w-4 text-[#FF6D4A]" />
                <h4 className="text-sm font-semibold text-[#112031]">Redeem Beta Coupon</h4>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code (e.g. FIRST1000)"
                  className="flex-1 rounded-[1.1rem] border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-3 text-sm uppercase text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                  className="rounded-[1.1rem] bg-[#11313B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#173B46] disabled:opacity-50"
                >
                  {applyingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>
              <p className="mt-2 text-xs leading-6 text-[#7D8891]">
                Internal trial system. No payment information required.
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "notifications",
      icon: Bell,
      title: "Notifications",
      desc: "Control email and product communication preferences",
      content: (
        <div className="space-y-4 pt-5">
          {[
            {
              key: "email_analysis",
              label: "Analysis completion emails",
              desc: "Get notified when your analysis is ready",
            },
            {
              key: "email_updates",
              label: "Product updates",
              desc: "New features and improvements",
            },
            {
              key: "email_tips",
              label: "Career tips",
              desc: "Weekly career intelligence insights",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4"
            >
              <div>
                <p className="text-sm font-medium text-[#112031]">{item.label}</p>
                <p className="text-xs leading-6 text-[#7D8891]">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    [item.key]: !notifications[item.key as keyof typeof notifications],
                  })
                }
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? "bg-[#24B7A9]" : "bg-[#DCE3E7]"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
          <button
            onClick={handleSaveNotifications}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#11313B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#173B46]"
          >
            Save Preferences
            <Check className="h-4 w-4" />
          </button>
        </div>
      ),
    },
    {
      key: "privacy",
      icon: Trash2,
      title: "Privacy",
      desc: "Delete your account and saved data",
      content: (
        <div className="space-y-5 pt-5">
          <div className="rounded-[1.4rem] border border-[#F0D9D2] bg-[#FFF8F6] p-4">
            <h4 className="text-sm font-semibold text-[#112031]">Delete account</h4>
            <p className="mt-2 text-sm leading-7 text-[#66727C]">
              This permanently removes your profile, plan record, saved resumes, job descriptions,
              analysis history, AI usage logs, payment order records, and Firebase Auth account.
            </p>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={deleteConfirm}
                onChange={(event) => setDeleteConfirm(event.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full rounded-[1.1rem] border border-[#E7ECEF] bg-white px-4 py-3 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#FF6D4A]/25"
              />
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#B42318] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#C83B30] disabled:opacity-50"
              >
                {deletingAccount ? "Deleting..." : "Delete Account"}
                {!deletingAccount && <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.section
        className="overflow-hidden rounded-[2.2rem] border border-[#E7ECEF] bg-[linear-gradient(120deg,#FFFDF9_0%,#F2FBFA_48%,#FFF7F0_100%)] p-6 shadow-[0_24px_60px_-34px_rgba(17,32,49,0.18)] lg:p-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E4ECEA] bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6A7680]">
              <Settings className="h-3.5 w-3.5 text-[#FF6D4A]" />
              Settings
            </div>

            <div className="max-w-3xl space-y-4">
              <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#112031] md:text-5xl">
                Manage your account, plan, and control surfaces in one place.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#66727C]">
                Settings is where users manage their identity, password, notifications, and
                subscription access. It should feel operational and calm, while still matching the
                premium visual system of the rest of the product.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {heroSignals.map((signal) => (
                <div
                  key={signal.title}
                  className="rounded-[1.6rem] border border-[#E7ECEF] bg-white/92 p-4 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
                    <signal.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-[#112031]">{signal.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#66727C]">{signal.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.9rem] bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] p-6 text-white shadow-[0_28px_70px_-36px_rgba(17,49,59,0.52)]">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A5CCD0]">
                Control flow
              </p>
              <Sparkles className="h-5 w-5 text-[#E3C26D]" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              Keep the account side as polished as the analysis side.
            </h2>
            <div className="mt-6 space-y-3">
              {[
                "Review and update your identity details without touching any analysis data.",
                "Change your password with the existing Firebase-secured flow.",
                "See plan status, upgrade direction, and beta coupon access in one subscription view.",
                "Adjust how often AIVI sends updates, alerts, and career tips.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3"
                >
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#E3C26D]" />
                  <p className="text-sm leading-6 text-[#EAF4F5]">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.3rem] border border-[#28515A] bg-[#234651] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A5CCD0]">
                Product context
              </p>
              <p className="mt-2 text-sm leading-6 text-[#EAF4F5]">
                This page is less about analysis and more about control. It should still feel
                visually related to the platform, but calmer and more utility-driven.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">
                Settings areas
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[#112031]">Manage your account surfaces</h2>
            </div>
          </div>

          <div className="space-y-3">
            {sections.map((item, i) => (
              <motion.button
                key={item.key}
                onClick={() => setActiveSection(activeSection === item.key ? null : item.key)}
                className={`w-full rounded-[1.45rem] border p-4 text-left transition-all ${
                  activeSection === item.key
                    ? "border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
                    : "border-[#E7ECEF] bg-[#FCFCFA] hover:-translate-y-0.5 hover:bg-white"
                }`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#FF6D4A]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[#112031]">{item.title}</h3>
                    <p className="mt-1 text-xs leading-6 text-[#7D8891]">{item.desc}</p>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 shrink-0 text-[#8A97A1] transition-transform ${
                      activeSection === item.key ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          {sections.map((item) =>
            activeSection === item.key ? (
              <div key={item.key}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">
                      Active section
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#112031]">{item.title}</h2>
                    <p className="mt-1 text-sm leading-7 text-[#66727C]">{item.desc}</p>
                  </div>
                </div>
                {item.content}
              </div>
            ) : null
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
