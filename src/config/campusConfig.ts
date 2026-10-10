/**
 * AIVI Campus Master Configuration & Rollback Kill-Switch Flags
 */
export const CAMPUS_CONFIG = {
  // Master kill-switch flag: If false, all campus routes fallback gracefully without breaking B2C SaaS.
  CAMPUS_ENABLED: true,

  // Staging / Production Firebase Project Parity
  PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aivi-career",
  IS_STAGING: import.meta.env.VITE_FIREBASE_PROJECT_ID === "aivi-campus-stg",

  // Master Feature Module Flags
  MODULE_FLAGS: {
    core_ai: true,
    drives: true,
    sprints: true,
    voice_hi: true,
    vault: true,
    accreditation: true,
    sso: true,
    api: true,
    parent_reports: true,
  },

  // Security & CSP Endpoint Whitelist
  ALLOWED_DOMAINS: [
    "aivi-career.web.app",
    "aivi-career.firebaseapp.com",
    "aivilabs.com",
    "bhashini.gov.in",
  ],
};
