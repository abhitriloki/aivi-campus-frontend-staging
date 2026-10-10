# 🛡️ AIVI CAMPUS OS — SAFE BUG FIX & SURGICAL PROTOCOL

> **MANDATORY INSTRUCTION FOR ALL AGENTS IN THIS WORKSPACE:**  
> When an issue or bug is reported in this repository, you must apply a **surgical fix to that target only**. Do NOT explore or refactor unrelated code.

---

## 1. 🎯 SURGICAL SCOPE LOCK
- **Direct Target Only**: Locate the exact file and lines responsible for the defect. Fix only those lines.
- **No Wide Searching**: Do not search the whole repository or database for clues if the file or module is already known.
- **Zero Unsolicited Refactoring**: Do not rename, restyle, or 'clean up' working adjacent code.

---

## 2. 🛡️ PROTECTED ECOSYSTEM BOUNDARIES & 4 ARTERIES
- **Artery 1 (Student Profiles)**: `profiles/{userId}` — Changing `placementStatus` NEVER mutates or wipes `resumeVerified`.
- **Artery 2 (Resume Vault)**: Monotonic version numbers; verify through `verifyResume` with `SEC-QR-...` token.
- **Artery 3 (Role Isolation)**: `CampusLayout` and `AuthContext` — Non-staff must evaluate to `isStudent = !isStaff`. Never leak admin buttons to students. Sprints operate under Option A (student view with practice CTA only).
- **Artery 4 (Rules & Contracts)**: Never rely on silent `localStorage` fallbacks when Firestore rejects a query. Fix the rule or `tenantId` filter.

---

## 3. 🧪 VERIFICATION GATE (BEFORE DECLARING FIXED)
- **Unit Tests**: Run `npm test` to confirm all 26 test suites (201+ tests) pass.
- **Build Verification**: Run `npm run build:staging` with 0 errors.
- **Changelog**: Log changes in `CHANGELOG.md` with UTC/IST timestamp, exact file + line, and one-line rollback command.
