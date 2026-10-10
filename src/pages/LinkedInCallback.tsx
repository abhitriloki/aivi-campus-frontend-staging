import { useEffect } from "react";

export default function LinkedInCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (window.opener) {
      window.opener.postMessage(
        {
          type: "LINKEDIN_AUTH_CODE",
          code,
          state,
          error: error || errorDescription,
        },
        "*"
      );
      window.close();
    } else {
      window.location.href = "/dashboard/linkedin";
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC] text-[#112031]">
      <div className="text-center p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-md max-w-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#0A66C2] mx-auto mb-3" />
        <h2 className="text-base font-bold text-[#0F172A]">Connecting with LinkedIn...</h2>
        <p className="text-xs text-[#64748B] mt-1">Authenticating your profile details securely.</p>
      </div>
    </div>
  );
}
