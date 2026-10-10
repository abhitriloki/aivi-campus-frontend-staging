# Technical Architecture — AIVI Career Intelligence Platform
> **Version**: 2.5.0 | **Updated**: October 1, 2026 | **Authoritative State**: Production Verified

## High-Level Architecture Overview

AIVI follows a **client-heavy, serverless backend** architecture powered natively by **Google Firebase v9/v10**, **Cloud Functions v2 (Node.js 20)**, and **Google Gemini 2.5 Flash / Gemini Live**.

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│                                                             │
│  React 18 + TypeScript + Vite 5                             │
│  ┌─────────┐  ┌────────────┐  ┌──────────────────────────┐  │
│  │ Router  │  │ Auth       │  │ Analysis Modules (7)     │  │
│  │ (RRv6)  │  │ Context    │  │ Resume, JobFit, Roadmap, │  │
│  │         │  │            │  │ Interview, Promotion,    │  │
│  │         │  │            │  │ Portfolio, LinkedIn      │  │
│  └────┬────┘  └─────┬──────┘  └───────────┬──────────────┘  │
│       │             │                      │                 │
│  ┌────┴─────────────┴──────────────────────┴──────────────┐  │
│  │              Service Layer                              │  │
│  │  analysisService.ts  │  planService.ts  │  pdfParser.ts│  │
│  └──────────────────────┴──────────────────┴──────────────┘  │
│       │                                                      │
│  ┌────┴──────────────────────────────────────────────────┐   │
│  │         Firebase Web SDK v10 (firebase/firestore/auth) │   │
│  └────┬──────────────────────────────────────────────────┘   │
└───────┼──────────────────────────────────────────────────────┘
        │ HTTPS Callable (v2)
        ▼
┌───────────────────────────────────────────────────────────────┐
│                 FIREBASE / GCP INFRASTRUCTURE                 │
│                                                               │
│  ┌──────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ Firebase     │  │ Cloud Firestore  │  │ Cloud Functions │  │
│  │ Auth         │  │                  │  │ v2 (Node 20)    │  │
│  │              │  │ Collections:     │  │                 │  │
│  │ Email/Pass   │  │ - users          │  │ careerAnalysis  │  │
│  │ Google OAuth │  │ - user_plans     │  │ extractPdf      │  │
│  │ JWT Tokens   │  │ - user_roles     │  │ linkedinAnalyze │  │
│  │              │  │ - profiles       │  │ linkedinOptimize│  │
│  │              │  │ - resume_vault   │  │ applyCoupon     │  │
│  │              │  │ - system_stats   │  │ adminUpdateUser │  │
│  └──────────────┘  └──────────────────┘  └────────┬────────┘  │
└───────────────────────────────────────────────────┼───────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────┐
                                    │    Google AI Infrastructure│
                                    │                           │
                                    │    Models:                │
                                    │    - gemini-2.5-flash     │
                                    │      (careerAnalysis &    │
                                    │       extractPdf vision)  │
                                    │    - gemini-2.0-flash live│
                                    │      (voice studio)       │
                                    │    - Sarvam AI            │
                                    │      (vernacular Hindi)   │
                                    └───────────────────────────┘
```

## Key Engineering Pillars
1. **Gemini 2.5 Flash Multimodal Vision**: Eliminates legacy PDF parsing failures by passing base64 PDF bytes directly to Gemini's vision pipeline.
2. **2-Way Real-Time Voice Studio**: 16kHz Web Audio stream with instant speech interruption handling, 3D fluid orb visualizer, and acoustic telemetry (WPM, clarity, filler words).
3. **Sliding-Window Rate Limiting**: In-memory rate limiting (3 requests/minute per UID) on `linkedinAnalyze`.
4. **Sovereign In-Memory Processing**: Voice audio is processed live in memory; no candidate audio files are stored, ensuring strict DPDP Act 2023 compliance.
