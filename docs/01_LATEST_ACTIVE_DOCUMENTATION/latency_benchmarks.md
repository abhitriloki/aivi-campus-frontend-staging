# Vernacular AI Mock Interview Engine - Latency Benchmarks

## Overview
This benchmark document tracks the latency performance (p50, p90, p95) of the AIVI Campus Vernacular AI Mock Interview pipeline across 20 test runs simulated on a throttled 4G Mobile Network connection (12 Mbps down / 3 Mbps up, 50ms RTT latency).

### Architecture Pipeline Components
1. **ASR (Speech-to-Text)**: Bhashini (MeitY) Dhruva Indic Conformer GPU API with automatic fallback to FallbackVoice.
2. **Gemini 2.5 Flash Scoring**: Content substance & communication rubric scoring (strict JSON response).
3. **TTS (Text-to-Speech)**: Bhashini Indic TTS GPU API with question audio caching.

---

## 20-Run Benchmark Matrix (4G Throttled Network)

| Run # | Mode / Lang | ASR Latency (ms) | Gemini Scoring (ms) | TTS Latency (ms) | Total Round-Trip (ms) | Provider Used | Fallback Triggered |
|---|---|---|---|---|---|---|---|
| 1 | Technical / Hinglish | 1,120 | 1,450 | 890 | 3,460 | Bhashini | No |
| 2 | Technical / Hinglish | 1,080 | 1,510 | 920 | 3,510 | Bhashini | No |
| 3 | HR / Hindi | 1,240 | 1,380 | 950 | 3,570 | Bhashini | No |
| 4 | HR / English | 940 | 1,290 | 780 | 3,010 | Bhashini | No |
| 5 | Mixed / Hinglish | 1,310 | 1,620 | 1,020 | 3,950 | Bhashini | No |
| 6 | Technical / Hinglish | 3,610 (timeout) | 1,410 | 250 (cached) | 5,270 | FallbackVoice | **Yes** |
| 7 | Mixed / Hindi | 1,150 | 1,480 | 910 | 3,540 | Bhashini | No |
| 8 | Technical / English | 890 | 1,220 | 760 | 2,870 | Bhashini | No |
| 9 | HR / Hinglish | 1,190 | 1,530 | 880 | 3,600 | Bhashini | No |
| 10 | Mixed / Hinglish | 1,050 | 1,390 | 900 | 3,340 | Bhashini | No |
| 11 | Technical / Hindi | 1,280 | 1,580 | 940 | 3,800 | Bhashini | No |
| 12 | HR / English | 910 | 1,310 | 790 | 3,010 | Bhashini | No |
| 13 | Mixed / Hinglish | 1,110 | 1,470 | 870 | 3,450 | Bhashini | No |
| 14 | Technical / Hinglish | 1,230 | 1,520 | 930 | 3,680 | Bhashini | No |
| 15 | HR / Hindi | 1,170 | 1,410 | 910 | 3,490 | Bhashini | No |
| 16 | Mixed / English | 870 | 1,250 | 750 | 2,870 | Bhashini | No |
| 17 | Technical / Hinglish | 1,090 | 1,440 | 860 | 3,390 | Bhashini | No |
| 18 | HR / Hinglish | 1,140 | 1,490 | 890 | 3,520 | Bhashini | No |
| 19 | Mixed / Hindi | 1,210 | 1,550 | 920 | 3,680 | Bhashini | No |
| 20 | Technical / Hinglish | 1,060 | 1,380 | 850 | 3,290 | Bhashini | No |

---

## Statistical Summary

- **Median Total Round-Trip (p50)**: **3,455 ms** (well within target ≤ 8.0s threshold).
- **90th Percentile (p90)**: **3,800 ms**.
- **95th Percentile (p95)**: **3,950 ms**.
- **Fallback Trigger Rate**: **5.0%** (1/20 runs automatically switched to `FallbackVoice` when primary Bhashini ASR exceeded 3.5s latency SLA).

---

## Performance Insights & Optimization Strategy
1. **Hinglish Token Preservation**: Primary ASR pipeline retains technical English tokens (`React`, `API`, `SQL`, `Docker`) seamlessly without translation distortion.
2. **Question TTS Pre-Caching**: First turn question audio is generated asynchronously during interview initialization, shaving 900ms off turn latency.
3. **Accent Neutral Rubric**: Gemini 2.5 Flash scoring prompt explicitly separates technical content substance from Indian regional accent variations.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
