import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPlanInfo, getPlanDisplayName, getPlanBadgeColor, type PlanInfo, type PlanType } from "@/services/planService";
import { Crown, Zap, Sparkles, ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";

const PlanUsageBanner = () => {
  const { user, tenant } = useAuth();
  const { branding } = useTenantBranding();
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);


  const isCampusUser = Boolean(
    ((tenant?.tenantId && tenant?.role === "student") ||
    user?.email?.endsWith(".ac.in") ||
    user?.email?.endsWith(".edu.in") ||
    user?.email?.includes("sunrise") ||
    user?.email?.includes("student")) &&
    tenant?.role !== "platform_admin"
  );

  useEffect(() => {
    if (!user) return;
    getUserPlanInfo(user.uid, user.email).then(setPlanInfo);
  }, [user]);

  if (!planInfo) return null;

  if (isCampusUser) {
    return (
      <div className="rounded-[1.8rem] border border-[#169C8F]/30 bg-slate-900 text-white p-5 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#169C8F]/20 text-[#169C8F] border border-[#169C8F]/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#169C8F]/20 text-[#169C8F] border border-[#169C8F]/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest">
                  CAMPUS ENTERPRISE
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">INSTITUTION SPONSORED</span>
              </div>
              <p className="mt-1.5 text-base font-extrabold text-white">Unlimited Institutional Access Active</p>
              <p className="mt-0.5 text-xs text-slate-300 font-medium">
                Sponsored by {branding?.name || "your institution"}. Full access to Resume Vault, Placement Drives & AI Career OS.
              </p>

            </div>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#169C8F]/20 border border-[#169C8F]/40 px-4 py-2.5 text-xs font-extrabold text-[#169C8F]">
            <ShieldCheck className="h-4 w-4" />
            Campus Verified
          </div>
        </div>
      </div>
    );
  }

  const plan = planInfo.plan_type as PlanType;
  const Icon = plan === "pro" ? Crown : plan === "starter" ? Sparkles : Zap;

  const renderUsageText = () => {
    if (plan === "pro") {
      return <span className="text-sm text-[#66727C]">Unlimited access across every intelligence module.</span>;
    }
    if (plan === "starter") {
      const trialText = planInfo.trial ? " during trial" : "";
      return (
        <span className="text-sm text-[#66727C]">
          {planInfo.monthly_analysis_used}/30 analyses used{trialText}.
        </span>
      );
    }

    const totalUsed =
      planInfo.lifetime_resume_count +
      planInfo.lifetime_jobfit_count +
      planInfo.lifetime_roadmap_count +
      planInfo.lifetime_interview_count +
      planInfo.lifetime_promotion_count +
      planInfo.lifetime_portfolio_count;
    const totalLimit = 2 + 2 + 1 + 1 + 1 + 1;

    return (
      <span className="text-sm text-[#66727C]">
        {totalUsed}/{totalLimit} lifetime analyses used. Upgrade when you want deeper guidance and more runs.
      </span>
    );
  };

  return (
    <div className="rounded-[1.8rem] border border-[#E7ECEF] bg-[linear-gradient(90deg,#FFFDF9_0%,#F5FBFA_100%)] p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] text-[#E3C26D]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getPlanBadgeColor(plan)}`}>
                {getPlanDisplayName(plan)}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A97A1]">Plan status</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-[#112031]">Your current access level is active.</p>
            <div className="mt-1">{renderUsageText()}</div>
          </div>
        </div>

        {plan !== "pro" && (
          <a
            href="/#pricing"
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#112031] shadow-[0_12px_30px_-22px_rgba(17,32,49,0.14)] transition-all hover:-translate-y-0.5"
          >
            Upgrade Plan
            <ArrowRight className="h-4 w-4 text-[#FF6D4A]" />
          </a>
        )}
      </div>
    </div>
  );
};

export default PlanUsageBanner;
