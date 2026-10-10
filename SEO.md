# AIVI Campus — Complete SEO, Social Unfurl & Telemetry Specification

**Document Version:** 1.0.0  
**Target Domain:** `https://aivicampus.com`  
**Platform Identity:** AIVI Campus — AI Employability OS for Colleges, Universities & TPO Cells  
**Google Analytics 4 Measurement ID:** `G-XG2DNV7E1C`  
**Last Updated:** September 9, 2026  

---

## 1. Executive Summary

This document serves as the handoff and implementation guide for the **SEO and Growth Marketing team**. 
All technical SEO, social unfurl cards, Google Analytics 4 tracking, and crawl assets have been deployed and verified for `aivicampus.com`.

### What Was Fixed & Upgraded:
1. **Chat & Social Sharing Unfurl Fix**: Eliminated legacy B2C "AIVI Career" metadata and replaced it with a dedicated 1200×630px institutional AIVI Campus social card.
2. **Canonical Domain Hardening**: Fixed all canonical tags from `aivilabs.com` to `https://aivicampus.com/`.
3. **Dedicated GA4 Stream**: Implemented Google Analytics 4 property `G-XG2DNV7E1C` (isolated from AIVI Career) with high-value institutional funnel event telemetry.
4. **Search Console Assets**: Deployed clean `sitemap.xml` and crawler-optimized `robots.txt`.
5. **Schema.org Structured Data**: Configured rich JSON-LD for `Organization`, `SoftwareApplication`, and `WebSite`.

---

## 2. Immediate Action Items for the SEO Team

### A. Google Search Console (GSC)
1. **Submit XML Sitemap**:
   - Go to **Sitemaps** in Google Search Console.
   - Add new sitemap: `https://aivicampus.com/sitemap.xml`
   - Verify that all submitted URLs return `HTTP 200`.
2. **Request Indexing for Primary URLs**:
   - Use URL Inspection on:
     - `https://aivicampus.com/`
     - `https://aivicampus.com/for-colleges`
     - `https://aivicampus.com/campus/login`
     - `https://aivicampus.com/dpa`
     - `https://aivicampus.com/contact`
   - Click **Request Indexing**.

### B. Social Scraper Cache Invalidation (Debuggers)
If WhatsApp or LinkedIn previously cached the old preview image, use these tools to clear their scraper caches:
- **LinkedIn Post Inspector**: [https://www.linkedin.com/post-inspector/](https://www.linkedin.com/post-inspector/) ➔ Enter `https://aivicampus.com/` and click **Inspect**.
- **Facebook Sharing Debugger**: [https://developers.facebook.com/tools/debug/](https://developers.facebook.com/tools/debug/) ➔ Enter `https://aivicampus.com/` and click **Scrape Again**.
- **Twitter / X Card Validator**: Share a test tweet or preview in X composer.
- **WhatsApp**: Send a message with `https://aivicampus.com/?v=1` to force WhatsApp to fetch the fresh card.

---

## 3. Core Page Metadata & Canonical Specifications

| Parameter | Implemented Value |
| :--- | :--- |
| **Page Title** | `AIVI Campus — AI Employability OS for Colleges, Universities & TPO Cells` |
| **Meta Description** | `India's premier AI Employability OS for colleges & universities. Vernacular voice AI mock interviews in Hindi & English, continuous AES readiness benchmarks, QR-verified resume vaults, and 1-click NAAC Criterion 5 / NIRF evidence generation.` |
| **Meta Keywords** | `AIVI Campus, AIVI Campus OS, campus placement software, TPO software India, NAAC Criterion 5 report generator, NIRF placement data, vernacular voice AI interview, AI mock interview Hindi, verified student resume vault, college placement cell automation, Indian universities placement portal, AES employability score, higher education placement management, campus recruitment management system` |
| **Canonical URL** | `https://aivicampus.com/` |
| **Robots Directive** | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |
| **Author / Org** | `AIVI Intelligence Private Limited` |

---

## 4. Open Graph & Social Card Specifications

### Asset Details:
- **File Paths in Codebase**: `public/og-image.png` & `public/brand/aivi-campus-og.png`
- **Live Asset URL**: `https://aivicampus.com/og-image.png?v=campus2`
- **Dimensions**: `1200 × 630 px` (Standard 1.91:1 ratio)
- **Design Tokens**: Dark Ink `#0B1220` institutional backdrop, AIVI Campus official emblem, headline *"Make every student placement-ready. Prove it with evidence."*, domain mark `aivicampus.com`, and feature pills.

### Open Graph Tags (WhatsApp, Facebook, LinkedIn):
```html
<meta property="og:site_name" content="AIVI Campus" />
<meta property="og:title" content="AIVI Campus — AI Employability OS for Colleges & Universities" />
<meta property="og:description" content="Make every student placement-ready. Prove it with evidence. Vernacular voice AI mock interviews, live AES scores, QR-verified resume vaults, and 1-click NAAC/NIRF evidence." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://aivicampus.com/" />
<meta property="og:image" content="https://aivicampus.com/og-image.png?v=campus2" />
<meta property="og:image:secure_url" content="https://aivicampus.com/og-image.png?v=campus2" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="AIVI Campus — AI Employability OS for Colleges & Universities" />
<meta property="og:locale" content="en_IN" />
```

### Twitter / X Cards:
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@aivilabs" />
<meta name="twitter:creator" content="@aivilabs" />
<meta name="twitter:title" content="AIVI Campus — AI Employability OS for Colleges & Universities" />
<meta name="twitter:description" content="Make every student placement-ready. Prove it with evidence. Vernacular voice AI mock interviews, live AES scores, QR-verified resume vaults, and 1-click NAAC/NIRF evidence." />
<meta name="twitter:image" content="https://aivicampus.com/og-image.png?v=campus2" />
```

---

## 5. Google Analytics 4 (GA4) & Event Telemetry

* **Property**: `AIVI Campus`
* **Web Data Stream**: `AIVI Campus Web`
* **Measurement ID**: `G-XG2DNV7E1C`
* **Global Site Tag (`gtag.js`)**: Installed directly in `<head>`.

### Custom Funnel Events Configured:

| Event Name | Trigger Location | Parameters Passed | Marketing Purpose |
| :--- | :--- | :--- | :--- |
| `page_view` | Every route transition | `page_path`, `page_title`, `page_location` | Traffic & page performance analysis |
| `campus_demo_booking_click` | Header, Hero, and Bottom CTA buttons | `location` (`header`, `hero`, `bottom_banner`) | Top-of-funnel conversion intent |
| `campus_demo_form_submitted` | Demo Booking Form submission | `institution`, `designation`, `strength`, `category` | Qualified institutional lead conversion |
| `campus_free_audit_applied` | 60-Day Free Audit CTA click | `source: "audit_section"` | Free audit trial intent |
| `campus_pricing_tier_selected` | Institutional pricing tier buttons | `tier`, `price` | High-intent pricing evaluation |
| `campus_naac_download_click` | NAAC Evidence Pack PDF button | `source: "evidence_section"` | Accreditation compliance interest |
| `campus_portal_login_click` | Header "Sign In / Open Campus OS" | `location: "header"`, `authenticated` | Returning user & staff engagement |

---

## 6. Structured Data (Schema.org JSON-LD)

Implemented directly in `index.html` via `@graph`:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://aivicampus.com/#organization",
      "name": "AIVI Intelligence Private Limited",
      "url": "https://aivicampus.com",
      "logo": "https://aivicampus.com/brand/aivi-logo-horizontal.svg",
      "description": "Enterprise AI Employability Operating System for Indian higher education institutions, colleges, and university TPO cells.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Gorakhpur",
        "addressRegion": "Uttar Pradesh",
        "addressCountry": "IN"
      }
    },
    {
      "@type": ["SoftwareApplication", "EducationalApplication"],
      "@id": "https://aivicampus.com/#software",
      "name": "AIVI Campus",
      "alternateName": "AIVI Campus Employability OS",
      "applicationCategory": "EducationalApplication, BusinessApplication",
      "operatingSystem": "Web, Cloud",
      "url": "https://aivicampus.com/",
      "description": "India's premier AI Employability OS for colleges & universities. Vernacular voice AI mock interviews in Hindi & English, live AES scores, QR-verified resume vaults, and 1-click NAAC/NIRF evidence.",
      "offers": {
        "@type": "Offer",
        "price": "100",
        "priceCurrency": "INR"
      },
      "featureList": [
        "Vernacular Voice AI Mock Interviews (Hindi & English)",
        "Continuous AIVI Employability Score (AES)",
        "QR-Verified Cryptographic Resume Vault",
        "1-Click NAAC Criterion 5.2.1 & NIRF Evidence Generator",
        "TPO Command Center & 7-Day Drive Sprints",
        "DPDP Act 2023 India-Hosted Data Governance"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://aivicampus.com/#website",
      "url": "https://aivicampus.com/",
      "name": "AIVI Campus",
      "publisher": {
        "@id": "https://aivicampus.com/#organization"
      }
    }
  ]
}
```

---

## 7. Crawl Assets (`sitemap.xml` & `robots.txt`)

### `public/sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://aivicampus.com/</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://aivicampus.com/for-colleges</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://aivicampus.com/campus/login</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://aivicampus.com/dpa</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://aivicampus.com/contact</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://aivicampus.com/privacy</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://aivicampus.com/terms</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### `public/robots.txt`
```txt
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Slackbot
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: *
Allow: /
Disallow: /tpo/
Disallow: /dashboard/
Disallow: /admin/
Disallow: /__/auth/
Disallow: /auth/action

Sitemap: https://aivicampus.com/sitemap.xml
```

---

## 8. Summary for SEO & Marketing Team
All changes are live in the production repository branch `release/aivicampus-prod-fresh-launch`.  
Once deployed, the SEO team can immediately log into **Google Search Console** and submit `https://aivicampus.com/sitemap.xml`, and monitor realtime visitors inside **Google Analytics 4** under property `AIVI Campus` (`G-XG2DNV7E1C`).
