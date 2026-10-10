# Chapter 08 — Master Error Catalogue & QA Diagnostic Guide
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Codebase String Audit [`src/pages/Auth.tsx`], [`src/pages/ResumeIntelligence.tsx`], [`src/pages/JobFitAnalysis.tsx`], [`src/services/paymentService.ts`], [`functions/src/index.ts`], [`functions/src/security/auth.ts`]

---

## 1. Master Error & Message Catalogue

The table below catalogs user-visible error strings, toast notifications, and alert messages across the entire codebase:

| Error ID | Exact Message Text (Verbatim) | Screen / Component File | Precise Trigger Condition | Recommended User Action | Retryable |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **ERR-001** | `"An account with this email already exists."` | `Auth.tsx` | Signup with email already registered in Firebase Auth | Click "Sign In" instead or reset password | No |
| **ERR-002** | `"Password should be at least 6 characters."` | `Auth.tsx` | Signup password string length < 6 | Enter a stronger password (>=6 characters) | Yes |
| **ERR-003** | `"Invalid email or password."` | `Auth.tsx` | Auth sign-in failure (`auth/invalid-credential`) | Verify email and password credentials | Yes |
| **ERR-004** | `"Email verification required."` | `ProtectedRoute.tsx` | Authenticated user has `emailVerified == false` | Check inbox for verification link or click Resend | Yes |
| **ERR-005** | `"Google sign-in popup was closed."` | `Auth.tsx` | User closes Google OAuth popup window before completion | Re-click "Continue with Google" | Yes |
| **ERR-006** | `"Popup blocked by browser. Enable popups to sign in with Google."` | `Auth.tsx` | Browser popup blocker prevents OAuth window | Allow popups for domain in browser settings | Yes |
| **ERR-007** | `"If an account exists for this email, a reset link has been sent."` | `Auth.tsx` | User submits password reset form | Check email inbox for password reset link | Yes |
| **ERR-008** | `"Free tier limit reached. Upgrade to Starter or Pro for unlimited resume scoring."` | `ResumeIntelligence.tsx` | Free user exceeds 2 lifetime resume analyses | Upgrade plan via Upgrade Modal | No |
| **ERR-009** | `"Resume text is too short to analyze."` | `ResumeUploadForm.tsx` | Uploaded/pasted resume text length < 50 characters | Provide a complete resume document | Yes |
| **ERR-010** | `"AI service is temporarily unavailable. Please try again."` | `analysisService.ts` | Gemini API timeout or backend error | Wait 10 seconds and re-click Analyze | Yes |
| **ERR-011** | `"Please provide both a resume and a job description."` | `JobFitAnalysis.tsx` | Job fit form submitted with missing resume or JD | Fill in both text fields before analyzing | Yes |
| **ERR-012** | `"The linkedin optimize feature is only available on Starter or Pro plans."` | `functions/src/index.ts` | Free user attempts LinkedIn profile rewrite | Upgrade to Starter or Pro subscription | No |
| **ERR-013** | `"Rate limit exceeded. Try again in a minute."` | `functions/src/index.ts` | User executes >3 AI analysis calls in 60 seconds | Wait 60 seconds before submitting next request | Yes |
| **ERR-014** | `"Unable to load Razorpay checkout script. Please check your network or adblocker/CSP settings."` | `paymentService.ts` | Razorpay JS fails to load within 10 seconds | Disable adblocker / check internet connection | Yes |
| **ERR-015** | `"Failed to open Razorpay modal. Please check browser pop-up settings or retry."` | `paymentService.ts` | Exception thrown when initializing Razorpay window | Allow popups or refresh page | Yes |
| **ERR-016** | `"DPDP consent required before running AI analysis."` | `functions/src/security/auth.ts` | Student user without DPDP consent triggers AI tool | Accept DPDP consent prompt in modal | Yes |
| **ERR-017** | `"Access denied for role."` | `functions/src/security/auth.ts` | Caller lacks required role claims for endpoint | Switch to authorized user account | No |
| **ERR-018** | `"Access denied for branch."` | `functions/src/security/auth.ts` | Coordinator accesses student outside `branchScope` | Request updated branch scope assignment | No |
| **ERR-019** | `"Tenant seat limit reached. Upgrade campus plan to add more students."` | `functions/src/index.ts` | CSV student import exceeds tenant `seats` quota | Upgrade institutional seat license | No |
| **ERR-020** | `"Microphone access denied. Please enable mic permissions in browser settings to use voice mode."` | `CampusInterviews.tsx` | User rejects browser microphone prompt | Grant microphone permission in browser bar | Yes |

---

## 2. QA Symptom -> Probable Cause -> Diagnostic Checks

| # | Observed User Symptom | Probable Root Cause | First Diagnostic Checks for QA Tester |
| :--- | :--- | :--- | :--- |
| 1 | Login succeeds, but immediately redirects back to `/verify-email` | User's email is not verified in Firebase Auth | Check `user.emailVerified` in Firebase Console. Click "Resend Email" and click link. |
| 2 | "Upgrade to Starter" modal opens when clicking LinkedIn Optimizer | User is on Free plan (`linkedin_optimize` requires paid tier) | Check `user_plans/{uid}` document. Verify `planType` is `"starter"` or `"pro"`. |
| 3 | AI Analysis fails with "Rate limit exceeded" toast | User clicked Analyze >3 times in under 1 minute | Inspect Firestore collection `ai_rate_limits/{uid}_careerAnalysis`. Wait 60s for reset. |
| 4 | Razorpay payment modal fails to launch after clicking Upgrade | Script blocked by browser adblocker or strict CSP policy | Open browser Developer Console. Check for blocked request to `checkout.razorpay.com`. |
| 5 | Campus student cannot launch Vernacular Mock Interview | Student has not accepted DPDP Privacy Consent prompt | Check `profiles/{uid}` doc for `dpdpConsent: true`. Accept consent modal on screen. |
| 6 | Coordinator cannot view CSE student profiles | Coordinator lacks `"CSE"` in custom claim `branchScope` | Inspect JWT ID token claims or `tenant_members` doc. Verify `branchScope` array. |
| 7 | CSV Student Import fails with "Tenant seat limit reached" | CSV row count + `seatsUsed` exceeds tenant `seats` quota | Inspect `tenants/{tenantId}` document. Compare `seatsUsed` vs `seats`. |
| 8 | Platform Admin Console displays "Access Denied" | Account email is not listed in `PLATFORM_ADMIN_ALLOWLIST` | Verify email in `functions/src/demoSeeder.ts`. Run `bootstrapPlatformAdmin` endpoint. |
| 9 | Vernacular Voice Interview fails to transcribe speech | Microphone blocked or Bhashini voice provider timeout | Check browser mic permissions. Verify network request to `bhashini.gov.in`. |
| 10 | 1-Click Demo Campus seeder fails with "Confirmation Required" | Tenant `demo-sunrise` already exists in Firestore | Pass `{ confirmExisting: true }` in seeder call or run `resetDemoCampus` first. |
