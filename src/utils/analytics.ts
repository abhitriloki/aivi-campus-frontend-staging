/**
 * AIVI Campus — Google Analytics 4 (GA4) Telemetry & Conversion Tracking
 * Default Measurement ID: G-XG2DNV7E1C (overridable via VITE_GA_MEASUREMENT_ID)
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GA_MEASUREMENT_ID) ||
  "G-XG2DNV7E1C";

/**
 * Check if analytics consent is granted
 */
function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("aivi_cookie_consent") === "accepted";
  } catch {
    return false;
  }
}

/**
 * Track a page view in Google Analytics (Gated behind DPDP Consent)
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!hasAnalyticsConsent()) {
    return; // DPDP Compliance: Suppress telemetry without affirmative consent
  }
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
    });
  }
}

export type CampusEventAction =
  | "campus_demo_booking_click"
  | "campus_demo_form_submitted"
  | "campus_free_audit_applied"
  | "campus_pricing_tier_selected"
  | "campus_voice_ai_interact"
  | "campus_command_center_explore"
  | "campus_naac_download_click"
  | "campus_portal_login_click";

interface CampusEventParams {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Track high-value institutional conversion events (Gated behind DPDP Consent)
 */
export function trackCampusEvent(
  action: CampusEventAction,
  params: CampusEventParams = {}
): void {
  if (!hasAnalyticsConsent()) {
    return; // DPDP Compliance: Suppress telemetry without affirmative consent
  }
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", action, {
        event_category: params.category || "institutional_funnel",
        event_label: params.label || "",
        value: params.value,
        timestamp: new Date().toISOString(),
        domain: window.location.hostname,
        ...params,
      });
    }
  } catch (err) {
    console.debug("[Analytics] Event track fallback:", action, err);
  }
}
