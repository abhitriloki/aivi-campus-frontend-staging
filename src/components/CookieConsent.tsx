import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Cookie, Settings2 } from "lucide-react";
import { GA_MEASUREMENT_ID, trackPageView } from "@/utils/analytics";

const CONSENT_KEY = "aivi_cookie_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function isAnalyticsConsentGranted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored === "accepted";
  } catch {
    return false;
  }
}

export function enableAnalytics(): void {
  if (typeof window === "undefined") return;
  const disableKey = `ga-disable-${GA_MEASUREMENT_ID}` as const;
  window[disableKey] = false;

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    });
    trackPageView(window.location.pathname, document.title);
  }
}

export function disableAnalytics(): void {
  if (typeof window === "undefined") return;
  const disableKey = `ga-disable-${GA_MEASUREMENT_ID}` as const;
  window[disableKey] = true;

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
    });
  }
}

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false); // Unticked by default per DPDP Act

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (consent === "accepted") {
        enableAnalytics();
      } else if (consent === "declined") {
        disableAnalytics();
      } else {
        // First-time visit: telemetry remains disabled until affirmative consent
        disableAnalytics();
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
      localStorage.setItem(
        `${CONSENT_KEY}_details`,
        JSON.stringify({
          essential: true,
          analytics: true,
          version: "dpdp-v1.0",
          timestamp: new Date().toISOString(),
        })
      );
    } catch {}
    enableAnalytics();
    setVisible(false);
  };

  const handleDeclineAll = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "declined");
      localStorage.setItem(
        `${CONSENT_KEY}_details`,
        JSON.stringify({
          essential: true,
          analytics: false,
          version: "dpdp-v1.0",
          timestamp: new Date().toISOString(),
        })
      );
    } catch {}
    disableAnalytics();
    setVisible(false);
  };

  const handleSavePreferences = () => {
    if (analyticsChecked) {
      handleAcceptAll();
    } else {
      handleDeclineAll();
    }
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Privacy and Cookie Consent Notice"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-5 text-slate-900 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.35)]"
    >
      <div className="flex items-start gap-3.5">
        <div className="rounded-xl bg-teal-50 p-2.5 text-teal-700 shrink-0 mt-0.5 border border-teal-100">
          <ShieldCheck className="h-5 w-5 text-[#169C8F]" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Cookie className="h-4 w-4 text-amber-600" />
              Digital Personal Data Protection & Cookie Preferences
            </h3>
            <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              DPDP Act 2023 Notice
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            AIVI Campus uses strictly essential cookies for secure session authentication and tenant isolation. Non-essential telemetry cookies (Google Analytics 4) are disabled by default under India's DPDP Act, 2023. You have the right to grant or decline non-essential cookies. Review our{" "}
            <Link to="/privacy" className="text-teal-700 font-semibold underline underline-offset-2 hover:text-teal-800">
              Privacy Notice
            </Link>{" "}
            and{" "}
            <Link to="/data-rights" className="text-teal-700 font-semibold underline underline-offset-2 hover:text-teal-800">
              Data Rights Form
            </Link>.
          </p>

          {showDetails && (
            <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold block">1. Strictly Necessary Cookies (Always Active)</span>
                  <span className="text-[11px] text-slate-500">Required for Firebase Auth, CSRF protection, and institutional tenant routing.</span>
                </div>
                <span className="text-[11px] font-bold text-teal-700 uppercase">Required</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <span className="font-semibold block">2. Anonymized Telemetry & Product Performance</span>
                  <span className="text-[11px] text-slate-500">Google Analytics 4 with IP anonymization to evaluate platform stability.</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analyticsChecked}
                    onChange={(e) => setAnalyticsChecked(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#169C8F] focus:ring-[#169C8F] cursor-pointer"
                  />
                  <span className="text-[11px] font-medium text-slate-600">Opt-in</span>
                </label>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Settings2 className="h-3.5 w-3.5" />
              {showDetails ? "Hide Details" : "Customize Preferences"}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={showDetails ? handleSavePreferences : handleDeclineAll}
                className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {showDetails ? "Save My Choice" : "Decline Non-Essential"}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-xl bg-[#169C8F] hover:bg-[#128076] text-white px-4 py-2 text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;
