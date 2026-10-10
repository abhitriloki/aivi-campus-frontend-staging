"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAMPUS_PLANS = void 0;
exports.getPlanDetails = getPlanDetails;
exports.CAMPUS_PLANS = {
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
function getPlanDetails(planId) {
    return exports.CAMPUS_PLANS[planId] || exports.CAMPUS_PLANS.starter;
}
//# sourceMappingURL=plans.js.map