import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/integrations/firebase/client";
import { reload } from "firebase/auth";
import { requestVerificationEmail } from "@/services/authEmailService";
import { toast } from "sonner";
import { MailWarning, RefreshCw, Send, Menu } from "lucide-react";
import AiviLogo from "../components/AiviLogo";

import DpdpConsentModal from "@/components/DpdpConsentModal";

const DashboardLayout = () => {
  const { user, tenant } = useAuth();
  const [loadingResend, setLoadingResend] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dpdpOpen, setDpdpOpen] = useState(false);

  useEffect(() => {
    // If student has tenantId, check if DPDP consent has been accepted
    if (user && tenant.tenantId && tenant.role === "student") {
      import("firebase/firestore").then(async ({ doc, getDoc }) => {
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();
        if (!db) return;
        const profileSnap = await getDoc(doc(db, "profiles", user.uid));
        if (!profileSnap.exists() || !profileSnap.data()?.dpdpConsent) {
          setDpdpOpen(true);
        }
      });
    }
  }, [user, tenant]);

  const handleResendEmail = async () => {
    if (!auth.currentUser) return;
    setLoadingResend(true);
    try {
      await requestVerificationEmail(auth.currentUser);
      toast.success("Verification email sent via Zoho! Please check your inbox.");
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please wait a few minutes before trying again.");
      } else {
        toast.error(error.message || "Failed to send verification email. Please try again.");
      }
    } finally {
      setLoadingResend(false);
    }
  };

  const handleRefreshStatus = async () => {
    if (!auth.currentUser) return;
    setLoadingRefresh(true);
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        toast.success("Email verified successfully! Thank you.");
        window.location.reload();
      } else {
        toast.error("Email not yet verified. Please check your inbox and click the link.");
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      toast.error("Failed to check status. Please try again.");
    } finally {
      setLoadingRefresh(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F6F8F7] text-[#112031]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-7rem] top-24 h-80 w-80 rounded-full bg-[#63D1C7]/10 blur-3xl" />
        <div className="absolute right-[-9rem] top-0 h-[26rem] w-[26rem] rounded-full bg-[#FFB59C]/12 blur-3xl" />
        <div className="absolute bottom-[-7rem] right-1/3 h-72 w-72 rounded-full bg-[#8AE0D8]/8 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col md:flex-row">
        <DashboardSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 border-b border-[#E8EDEE] bg-[#FCFBF8]/92 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[#E5E8EC] bg-white p-2 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.22)]">
                  <AiviLogo size={20} className="text-[#D59C45]" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold leading-none tracking-tight text-[#112031]">AIVI</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#8A97A1]">Career Intelligence OS</p>
                </div>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-xl border border-[#E3E8EC] bg-white p-2 text-[#55626D] shadow-[0_12px_30px_-24px_rgba(17,32,49,0.18)] transition-colors hover:bg-[#FBFCFC]"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              {user && !user.emailVerified && (
                <div className="rounded-[1.8rem] border border-[#F1D4A5] bg-[linear-gradient(90deg,#FFF8EA_0%,#FFFDF8_100%)] p-4 shadow-[0_18px_44px_-30px_rgba(181,150,90,0.22)] sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FDE8BF] text-[#B77A1D]">
                        <MailWarning className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#112031]">Verify your email to secure your workspace</p>
                        <p className="mt-1 text-sm leading-7 text-[#6B7680]">
                          Check your inbox or spam folder, then refresh the status here once you’ve clicked the link.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={handleResendEmail}
                        disabled={loadingResend}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ECD8B3] bg-white px-4 py-3 text-sm font-semibold text-[#8D5C16] transition-all hover:-translate-y-0.5 hover:bg-[#FFF9EF] disabled:translate-y-0 disabled:opacity-60"
                      >
                        {loadingResend ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Resend Email
                      </button>
                      <button
                        onClick={handleRefreshStatus}
                        disabled={loadingRefresh}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_46px_-26px_rgba(255,109,74,0.48)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:translate-y-0 disabled:opacity-60"
                      >
                        <RefreshCw className={`h-4 w-4 ${loadingRefresh ? "animate-spin" : ""}`} />
                        Refresh Status
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="min-w-0 rounded-[2rem] border border-[#E7ECEF] bg-[#FCFBF8]/92 shadow-[0_24px_80px_-44px_rgba(17,32,49,0.16)]">
                <div className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <DpdpConsentModal open={dpdpOpen} onConsentAccepted={() => setDpdpOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
