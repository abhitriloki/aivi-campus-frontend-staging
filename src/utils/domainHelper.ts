import { extractSubdomainSlug } from "@/contexts/TenantBrandingContext";

export function isCampusDomain(hostname: string): boolean {
  if (!hostname) return false;
  const cleanHost = hostname.toLowerCase().trim();

  // Localhost in Campus OS project defaults to Campus
  if (cleanHost === "localhost" || cleanHost === "127.0.0.1" || cleanHost === "campus.localhost") {
    return true;
  }

  // Explicit Campus domains & subdomains
  if (
    cleanHost === "aivicampus.com" ||
    cleanHost === "www.aivicampus.com" ||
    cleanHost === "staging.aivicampus.com" ||
    cleanHost.endsWith(".aivicampus.com") ||
    cleanHost === "campus.aivilabs.com" ||
    cleanHost === "campus.staging.aivilabs.com" ||
    cleanHost === "isolation-staging.aivicampus.com" ||
    cleanHost.startsWith("campus.") ||
    cleanHost.includes(".campus.")
  ) {
    return true;
  }

  // College tenant subdomains e.g. bit.aivilabs.com or bit.staging.aivilabs.com
  const slug = extractSubdomainSlug(cleanHost);
  if (slug && slug !== "www" && slug !== "app" && slug !== "staging") {
    return true;
  }

  return false;
}
