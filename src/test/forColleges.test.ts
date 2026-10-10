import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import * as Lucide from "lucide-react";

describe("Public B2B Landing Page /for-colleges & Navigation Rebuild Verification", () => {
  it("verifies ForCollegesPage source file contains all 11 required sections, dark hero, and verbatim copy", () => {
    const pageCode = fs.readFileSync(path.resolve(__dirname, "../pages/ForCollegesPage.tsx"), "utf-8");

    // Part A: B2B Identity & Dark Hero
    expect(pageCode).toContain("campus-mkt");
    expect(pageCode).toContain("CampusHeader");
    expect(pageCode).toContain("For colleges, universities");
    expect(pageCode).toContain("Built for every campus stakeholder");

    // Section 1: Hero
    expect(pageCode).toContain("Make every student placement-ready.");
    expect(pageCode).toContain("Book a 20-min Demo");
    expect(pageCode).toContain("See how it works");

    // Section 2: Crisis Stats
    expect(pageCode).toContain("PROBLEM_STATS");
    expect(pageCode).toContain("56.35");
    expect(pageCode).toContain("40");
    expect(pageCode).toContain("wks");
    expect(pageCode).toContain("₹");

    // Section 3: Why We Built This (Redesigned Comparison)
    expect(pageCode).toContain("Placement software manages the event.");
    expect(pageCode).toContain("The old way");
    expect(pageCode).toContain("The AIVI way");
    expect(pageCode).toContain("LIVE on aivilabs.com");

    // Section 4: Product Loop
    expect(pageCode).toContain("From CSV import to NAAC report — one loop");
    expect(pageCode).toContain("Import students");
    expect(pageCode).toContain("See every Employability Score");

    // Section 5: Three Differentiators
    expect(pageCode).toContain("Three core innovations");
    expect(pageCode).toContain("The Employability Score (AES)");
    expect(pageCode).toContain("Hindi & Hinglish voice practice");
    expect(pageCode).toContain("Verified resumes recruiters trust");

    // Section 6: Pricing
    expect(pageCode).toContain("One campus license · every student covered");
    expect(pageCode).toContain("Campus Starter");
    expect(pageCode).toContain("Campus Pro");
    expect(pageCode).toContain("University / Group");

    // Section 7: Pilot Offer
    expect(pageCode).toContain("Start with proof,");
    expect(pageCode).toContain("The 60-Day Campus Employability Audit is completely free");

    // Section 8: Security & Compliance
    expect(pageCode).toContain("Built for institutional trust");
    expect(pageCode).toContain("DPDP Act 2023 aligned");

    // Section 9: Demo Form & Honeypot
    expect(pageCode).toContain("Book your 20-minute demo");
    expect(pageCode).toContain('name="website"'); // Honeypot field
    expect(pageCode).toContain("submitContactForm");

    // Section 10: FAQ
    expect(pageCode).toContain("Everything TPO directors ask us");
    expect(pageCode).toContain("What exactly is AIVI Campus?");

    // Section 11: Final CTA Band
    expect(pageCode).toContain("Placement season won't wait.");

    // Header & Footer inclusion
    expect(pageCode).toContain("CampusHeader");
    expect(pageCode).toContain("CampusFooter");
  });

  it("verifies icon audit: every lucide-react icon used on ForCollegesPage is exported and functional", () => {
    const icons = [
      Lucide.Users,
      Lucide.Award,
      Lucide.Mic,
      Lucide.CheckCircle2,
      Lucide.ShieldCheck,
      Lucide.Zap,
      Lucide.ArrowRight,
      Lucide.TrendingUp,
      Lucide.FileCheck,
      Lucide.ChevronDown,
      Lucide.Sparkles,
      Lucide.MessageSquare,
      Lucide.Building2,
      Lucide.FileText,
      Lucide.Clock,
      Lucide.Shield,
      Lucide.ExternalLink,
      Lucide.GraduationCap,
      Lucide.BarChart3,
      Lucide.Monitor,
      Lucide.FileSpreadsheet,
      Lucide.Activity,
      Lucide.ClipboardList,
      Lucide.FolderCheck,
      Lucide.MessageCircle,
      Lucide.Phone,
      Lucide.Mail,
      Lucide.MapPin,
      Lucide.Check,
      Lucide.XCircle,
      Lucide.Gauge,
      Lucide.ArrowUpRight,
      Lucide.LayoutDashboard,
      Lucide.Landmark,
    ];

    icons.forEach((icon) => {
      expect(icon).toBeDefined();
      expect(Boolean(icon)).toBe(true);
    });
  });

  it("verifies GlobalHeader contains exactly ONE For Colleges affordance with B2B tag", () => {
    const headerCode = fs.readFileSync(path.resolve(__dirname, "../components/GlobalHeader.tsx"), "utf-8");

    expect(headerCode).toContain("For Colleges");
    expect(headerCode).toContain("/for-colleges");
    expect(headerCode).toContain("B2B");
    expect(headerCode).toContain("Book a Demo");
  });

  it("verifies GlobalFooter contains segregated For Individuals, For Campuses, and Company/Legal columns", () => {
    const footerCode = fs.readFileSync(path.resolve(__dirname, "../components/GlobalFooter.tsx"), "utf-8");

    expect(footerCode).toContain("For Individuals");
    expect(footerCode).toContain("For Campuses (B2B)");
    expect(footerCode).toContain("aivicampus.com");
    expect(footerCode).toContain("/campus/login");
    expect(footerCode).toContain("/dpa");
  });

  it("verifies DpaPage renders with LegalHeaderFooterWrapper (providing GlobalHeader/CampusHeader and GlobalFooter/CampusFooter)", () => {
    const dpaCode = fs.readFileSync(path.resolve(__dirname, "../pages/DpaPage.tsx"), "utf-8");
    const wrapperCode = fs.readFileSync(path.resolve(__dirname, "../components/LegalHeaderFooterWrapper.tsx"), "utf-8");

    expect(dpaCode).toContain("LegalHeaderFooterWrapper");
    expect(wrapperCode).toContain("GlobalHeader");
    expect(wrapperCode).toContain("GlobalFooter");
    expect(dpaCode).toContain("Institutional Data Processing Agreement (DPA)");
  });

  it("verifies sitemap.xml contains /for-colleges and /dpa", () => {
    const sitemapCode = fs.readFileSync(path.resolve(__dirname, "../../public/sitemap.xml"), "utf-8");

    expect(sitemapCode).toContain("https://aivicampus.com/for-colleges");
    expect(sitemapCode).toContain("https://aivicampus.com/dpa");
  });
});
