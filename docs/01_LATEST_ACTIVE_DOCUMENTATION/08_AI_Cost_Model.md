# AIVI System Documentation — AI Cost Model & Unit Economics
> **Version**: 2.5.0 | **Updated**: October 1, 2026 | **Authoritative State**: Production Verified

Running Generative AI inside a SaaS product requires rigorous financial oversight over Token-to-Revenue ratios. AIVI standardized on **Google Gemini 2.5 Flash** (`gemini-2.5-flash`) for multi-page document vision and structural JSON scoring, and **Gemini 2.0 Flash / Sarvam AI** for real-time speech telemetry.

## 1. Core Model Economics (Gemini 2.5 Flash)
*Pricing based on Google Cloud Vertex AI & AI Studio standard production tiers:*

- **Prompt Tokens (Input)**: ~$0.075 per 1,000,000 tokens ($0.000075 / 1k tokens).
- **Completion Tokens (Output)**: ~$0.30 per 1,000,000 tokens ($0.00030 / 1k tokens).
- **Context Window**: 1,000,000+ tokens (enables passing entire base64-encoded PDF multi-page files directly into multimodal vision without OCR fragmentation).

## 2. Per-Feature Token Approximations & Unit Costs

| Feature Endpoint | Avg Prompt (In) | Avg Completion (Out) | Est Cost ($ USD) | Est Cost (₹ INR) | Margin at ₹399/mo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`careerAnalysis` (Resume)** | 1,400 | 600 | $0.00028 | ₹0.023 | >99.9% |
| **`extractPdf` (Vision)** | 3,500 (Base64) | 800 (Text) | $0.00050 | ₹0.042 | >99.9% |
| **`careerAnalysis` (Job Fit)** | 2,200 | 900 | $0.00043 | ₹0.036 | >99.9% |
| **`linkedinAnalyze`** | 1,100 | 400 | $0.00020 | ₹0.017 | >99.9% |
| **`linkedinOptimize`** | 1,800 | 1,200 | $0.00049 | ₹0.041 | >99.9% |
| **2-Way Voice Round (5 Qs)** | Audio Stream | Telemetry Score | $0.00120 | ₹0.100 | >99.7% |

*Calculation Methodology:* `(PromptTokens / 1,000,000 * 0.075) + (CompletionTokens / 1,000,000 * 0.30)`

## 3. Cost Per User / Break-Even Analysis

### Heavy Power User Simulation (Starter Plan — ₹399/mo)
A heavy monthly user executing:
- 15 ATS Resume Analyses & Tailorings
- 10 Job Fit Matches
- 5 LinkedIn Profile Optimizations
- 5 Live 2-Way Voice Mock Interviews
- 2 Skill Roadmaps

**Monthly Operational Token Footprint**:
- Input: ~90,000 Tokens = $0.00675 USD
- Output: ~35,000 Tokens = $0.01050 USD
- **Total AI Compute Cost per User per Month**: ~$0.017 USD (**~₹1.45 INR**).

### Gross Margin Verdict
At a consumer subscription fee of ₹399/month, with an AI infrastructure cost of ~₹1.45/month, **the gross margin on AI compute exceeds 99.6%**. 

## 4. Cost Exposure & Anti-Depletion Safeguards
1. **Sliding-Window Rate Limiting**: In-memory sliding window limiter on `linkedinAnalyze` restricts users to 3 requests per 60 seconds.
2. **Quota Verification Pre-Hook**: Every AI function executes `checkUsage` before invoking Gemini.
3. **Session Abort Guard**: Voice interview sessions with <5 candidate words terminate without dispatching post-session LLM scoring evaluations.
