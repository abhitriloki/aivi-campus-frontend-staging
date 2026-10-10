import { createRoot } from "react-dom/client";
import { validateEnvironmentContract } from "@/config/envContract";
import App from "./App.tsx";
import "./index.css";

function renderStartupError(message: string) {
  const rootEl = document.getElementById("root");
  if (!rootEl) return;
  rootEl.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
      <div style="background: #1e293b; border: 1px solid #ef4444; border-radius: 12px; padding: 32px; max-width: 560px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <h1 style="color: #ef4444; font-size: 20px; margin-top: 0; margin-bottom: 12px; font-weight: 700;">Fail-Closed Configuration Error</h1>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
          The application refused to start because the runtime environment contract failed security validation. All connections have been blocked.
        </p>
        <div style="background: #0f172a; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 12px; color: #fca5a5; word-break: break-all;">
          ${message}
        </div>
      </div>
    </div>
  `;
}

try {
  const product = import.meta.env.VITE_APP_PRODUCT;
  const env = import.meta.env.VITE_APP_ENVIRONMENT;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const buildVersion = import.meta.env.VITE_BUILD_VERSION;
  const commitSha = import.meta.env.VITE_GIT_COMMIT_SHA;
  const runtimeHostname = typeof window !== "undefined" ? window.location.hostname : "";

  validateEnvironmentContract({
    product: product || "",
    environment: env || "",
    projectId: projectId || "",
    buildVersion: buildVersion || "",
    commitSha: commitSha || "",
    runtimeHostname,
    isTest: import.meta.env.MODE === "test",
  });

  createRoot(document.getElementById("root")!).render(<App />);
} catch (err: any) {
  console.error("[CRITICAL] Application startup aborted:", err);
  renderStartupError(err?.message || "Unknown environment contract violation");
}

