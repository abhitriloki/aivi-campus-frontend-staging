export interface CampusPlan {
  id: "trial" | "starter" | "growth" | "pro" | "university";
  name: string;
  maxSeats: number;
  durationDays: number;
  pricePerSeatPaise: number;
  modules: string[];
}

export const CAMPUS_PLANS: Record<string, CampusPlan> = {
  trial: {
    id: "trial",
    name: "Campus Trial",
    maxSeats: 500,
    durationDays: 60,
    pricePerSeatPaise: 0,
    modules: ["core_ai", "drives", "sprints"],
  },
  starter: {
    id: "starter",
    name: "Campus Starter",
    maxSeats: 1000,
    durationDays: 365,
    pricePerSeatPaise: 10000, // ₹100 / seat / year
    modules: ["core_ai", "drives", "sprints"],
  },
  growth: {
    id: "growth",
    name: "Campus Growth",
    maxSeats: 2000,
    durationDays: 365,
    pricePerSeatPaise: 9000, // ₹90 / seat / year
    modules: ["core_ai", "drives", "sprints", "voice_hi", "vault"],
  },
  pro: {
    id: "pro",
    name: "Campus Pro",
    maxSeats: 3000,
    durationDays: 365,
    pricePerSeatPaise: 8300, // ₹83 / seat / year
    modules: ["core_ai", "drives", "sprints", "voice_hi", "vault"],
  },
  university: {
    id: "university",
    name: "University Enterprise",
    maxSeats: 10000,
    durationDays: 365,
    pricePerSeatPaise: 8000, // ₹80 / seat / year
    modules: ["core_ai", "drives", "sprints", "voice_hi", "vault", "accreditation", "sso", "api"],
  },
};

export function getPlanDetails(planId: string): CampusPlan {
  return CAMPUS_PLANS[planId] || CAMPUS_PLANS.starter;
}
