import { describe, it, expect } from "vitest";
import { isCampusDomain } from "../utils/domainHelper";
import { extractSubdomainSlug } from "../contexts/TenantBrandingContext";

describe("aivicampus.com Domain Resolution & Segregation", () => {
  it("identifies aivicampus.com as a campus domain", () => {
    expect(isCampusDomain("aivicampus.com")).toBe(true);
    expect(isCampusDomain("www.aivicampus.com")).toBe(true);
    expect(isCampusDomain("staging.aivicampus.com")).toBe(true);
  });

  it("identifies partner college subdomains under aivicampus.com as campus domains", () => {
    expect(isCampusDomain("sunrise.aivicampus.com")).toBe(true);
    expect(isCampusDomain("gla.aivicampus.com")).toBe(true);
    expect(isCampusDomain("sunrise.staging.aivicampus.com")).toBe(true);
  });

  it("extracts college slug accurately from aivicampus.com subdomains", () => {
    expect(extractSubdomainSlug("aivicampus.com")).toBe(null);
    expect(extractSubdomainSlug("www.aivicampus.com")).toBe(null);
    expect(extractSubdomainSlug("staging.aivicampus.com")).toBe(null);
    expect(extractSubdomainSlug("sunrise.aivicampus.com")).toBe("sunrise");
    expect(extractSubdomainSlug("gla.aivicampus.com")).toBe("gla");
    expect(extractSubdomainSlug("sunrise.staging.aivicampus.com")).toBe("sunrise");
  });

  it("keeps aivilabs.com B2C root distinct from campus domain", () => {
    expect(isCampusDomain("aivilabs.com")).toBe(false);
    expect(isCampusDomain("www.aivilabs.com")).toBe(false);
    expect(isCampusDomain("app.aivilabs.com")).toBe(false);
    expect(isCampusDomain("staging.aivilabs.com")).toBe(false);
  });

  it("identifies campus.aivilabs.com as campus domain for backwards compatibility", () => {
    expect(isCampusDomain("campus.aivilabs.com")).toBe(true);
    expect(isCampusDomain("campus.staging.aivilabs.com")).toBe(true);
  });
});
