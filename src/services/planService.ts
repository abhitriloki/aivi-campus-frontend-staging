import { httpsCallable } from "firebase/functions";
import { doc, getDoc } from "firebase/firestore";
import { getDb, functions } from "@/integrations/firebase/client";

export type PlanType = "free" | "starter" | "pro" | "admin";

export interface PlanInfo {
  plan_type: PlanType;
  monthly_analysis_used: number;
  lifetime_resume_count: number;
  lifetime_jobfit_count: number;
  lifetime_roadmap_count: number;
  lifetime_interview_count: number;
  lifetime_promotion_count: number;
  lifetime_portfolio_count: number;
  lifetime_linkedin_count: number;
  lifetime_linkedin_opt_count: number;
  trial: boolean;
  trialExpiresAt: { seconds: number; nanoseconds: number } | null;
  trialUsed: boolean;
}

export interface UsageCheckResult {
  allowed: boolean;
  plan?: string;
  used?: number;
  limit?: number;
  remaining?: number;
  reason?: string;
  trial?: boolean;
  trialExpiresAt?: { seconds: number; nanoseconds: number } | null;
}

export const FREE_LIMITS: Record<string, number> = {
  resume: 2,
  job_fit: 2,
  roadmap: 1,
  interview: 1,
  promotion: 1,
  portfolio: 1,
  resume_rebuild: 2,
  linkedin_analyze: 2,
  linkedin_optimize: 0,
};

// Get user plan info from Firestore (direct read — user_plans/{uid})
export const getUserPlanInfo = async (userId: string, userEmail?: string | null): Promise<PlanInfo> => {
  const proPlanFallback: PlanInfo = {
    plan_type: "pro",
    monthly_analysis_used: 0,
    lifetime_resume_count: 0,
    lifetime_jobfit_count: 0,
    lifetime_roadmap_count: 0,
    lifetime_interview_count: 0,
    lifetime_promotion_count: 0,
    lifetime_portfolio_count: 0,
    lifetime_linkedin_count: 0,
    lifetime_linkedin_opt_count: 0,
    trial: false,
    trialExpiresAt: null,
    trialUsed: false,
  };

  try {
    const auth = (await import("@/integrations/firebase/client")).auth;
    const currentUser = auth.currentUser;
    const emailToCheck = userEmail || currentUser?.email;

    const isInstitutionalEmail = Boolean(
      emailToCheck && (
        emailToCheck.endsWith(".ac.in") ||
        emailToCheck.endsWith(".edu.in") ||
        emailToCheck.endsWith(".edu") ||
        emailToCheck.includes("sunrise.ac.in") ||
        emailToCheck.includes("student")
      )
    );

    // 1. Check Auth custom claims or institutional email
    if (currentUser) {
      const token = await currentUser.getIdTokenResult().catch(() => null);
      const claims = (token?.claims as any) || {};
      const isCampusUser = Boolean(
        claims.tenantId ||
        ["student", "tenant_admin", "coordinator", "platform_admin", "placement_director", "tpo", "staff", "placement_staff"].includes(claims.role) ||
        isInstitutionalEmail
      );
      if (isCampusUser) {
        return proPlanFallback;
      }
    }

    // 2. Check Firestore profiles document directly (handles fresh signups where claims haven't refreshed)
    try {
      const profileSnap = await getDoc(doc(getDb(), "profiles", userId));
      if (profileSnap.exists()) {
        const pData = profileSnap.data();
        const role = pData?.role;
        const hasTenant = Boolean(pData?.tenantId);
        const isStudentOrStaff = ["student", "tenant_admin", "coordinator", "platform_admin", "placement_director", "tpo", "staff", "placement_staff"].includes(role);
        if (hasTenant || isStudentOrStaff) {
          return proPlanFallback;
        }
      }
    } catch (profErr) {
      console.warn("Profile check in getUserPlanInfo:", profErr);
    }

    // 3. Check Campus OS runtime route or domain environment
    if (typeof window !== "undefined") {
      const isCampusEnv =
        window.location.pathname.startsWith("/campus") ||
        window.location.hostname.includes("aivicampus.com") ||
        Boolean(localStorage.getItem("aivi_active_tenant"));
      if (isCampusEnv) {
        return proPlanFallback;
      }
    }
  } catch (e) {
    console.warn("Auth check in getUserPlanInfo:", e);
  }

  const snap = await getDoc(doc(getDb(), "user_plans", userId));
  if (!snap.exists()) {
    if (typeof window !== "undefined" && (window.location.pathname.startsWith("/campus") || window.location.hostname.includes("aivicampus.com"))) {
      return proPlanFallback;
    }
    return {
      plan_type: "free",
      monthly_analysis_used: 0,
      lifetime_resume_count: 0,
      lifetime_jobfit_count: 0,
      lifetime_roadmap_count: 0,
      lifetime_interview_count: 0,
      lifetime_promotion_count: 0,
      lifetime_portfolio_count: 0,
      lifetime_linkedin_count: 0,
      lifetime_linkedin_opt_count: 0,
      trial: false,
      trialExpiresAt: null,
      trialUsed: false,
    };
  }
  const data = snap.data();
  return {
    plan_type: (data.plan_type ?? "free") as PlanType,
    monthly_analysis_used: data.monthly_analysis_used ?? 0,
    lifetime_resume_count: data.lifetime_resume_count ?? 0,
    lifetime_jobfit_count: data.lifetime_jobfit_count ?? 0,
    lifetime_roadmap_count: data.lifetime_roadmap_count ?? 0,
    lifetime_interview_count: data.lifetime_interview_count ?? 0,
    lifetime_promotion_count: data.lifetime_promotion_count ?? 0,
    lifetime_portfolio_count: data.lifetime_portfolio_count ?? 0,
    lifetime_linkedin_count: data.lifetime_linkedin_count ?? 0,
    lifetime_linkedin_opt_count: data.lifetime_linkedin_opt_count ?? 0,
    trial: data.trial ?? false,
    trialExpiresAt: data.trialExpiresAt ?? null,
    trialUsed: data.trialUsed ?? false,
  };
};

export const checkAndIncrementUsage = async (
  userId: string,
  analysisType: string
): Promise<UsageCheckResult> => {
  try {
    const auth = (await import("@/integrations/firebase/client")).auth;
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdTokenResult().catch(() => null);
      const claims = (token?.claims as any) || {};
      const isInstitutionalEmail = Boolean(
        currentUser.email && (
          currentUser.email.endsWith(".ac.in") ||
          currentUser.email.endsWith(".edu.in") ||
          currentUser.email.endsWith(".edu") ||
          currentUser.email.includes("sunrise.ac.in") ||
          currentUser.email.includes("student")
        )
      );
      const isCampusUser = Boolean(
        claims.tenantId ||
        ["student", "tenant_admin", "coordinator", "platform_admin", "placement_director", "tpo", "staff", "placement_staff"].includes(claims.role) ||
        isInstitutionalEmail
      );
      if (isCampusUser) {
        return { allowed: true, plan: "pro" };
      }
    }

    // Check profiles collection if claims lack tenantId
    try {
      const profileSnap = await getDoc(doc(getDb(), "profiles", userId));
      if (profileSnap.exists()) {
        const pData = profileSnap.data();
        if (pData?.tenantId || ["student", "tpo", "staff", "coordinator", "placement_director", "tenant_admin", "platform_admin"].includes(pData?.role)) {
          return { allowed: true, plan: "pro" };
        }
      }
    } catch {
      // ignore
    }

    // Check Campus environment
    if (typeof window !== "undefined") {
      const isCampusEnv =
        window.location.pathname.startsWith("/campus") ||
        window.location.hostname.includes("aivicampus.com") ||
        Boolean(localStorage.getItem("aivi_active_tenant"));
      if (isCampusEnv) {
        return { allowed: true, plan: "pro" };
      }
    }

    const fn = httpsCallable<{ analysisType: string }, UsageCheckResult>(
      functions,
      "checkUsage"
    );
    const result = await fn({ analysisType });
    return result.data;
  } catch (error: any) {
    if (error?.code === "functions/resource-exhausted") {
      return { allowed: false, reason: error.message };
    }
    return { allowed: true, plan: "pro" };
  }
};

export const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
  const fn = httpsCallable<{ code: string }, { success: boolean; message: string }>(
    functions,
    "applyCoupon"
  );
  const result = await fn({ code });
  return result.data;
};

// ─── Display Helpers ──────────────────────────────────────────────────────

export const getPlanDisplayName = (plan: PlanType): string => {
  switch (plan) {
    case "pro": return "Pro";
    case "starter": return "Starter";
    case "admin": return "Admin (Unlimited)";
    default: return "Free (Discovery)";
  }
};

export const getPlanBadgeColor = (plan: PlanType): string => {
  switch (plan) {
    case "pro": return "bg-primary/20 text-primary";
    case "starter": return "bg-primary/10 text-primary";
    case "admin": return "bg-pink-500/20 text-pink-500 border-pink-500/50 border";
    default: return "bg-secondary text-muted-foreground";
  }
};
