# 🛡️ AIVI CAMPUS OS — SAFE BUG FIX & BLAST-RADIUS DEFENSE PROTOCOL

> **MANDATORY INSTRUCTION FOR ALL AGENTS IN THIS WORKSPACE:**  
> Whenever an intern, founder, or QA team member reports a bug, you MUST NEVER make an isolated code edit without first executing the **Pre-Fix Blast-Radius Audit** and passing the **Post-Fix Regression Gate**.

---

## 1. 🧠 THE 4 INTERCONNECTED ARTERIES OF CAMPUS OS

A change in one file almost always affects other modules across the platform. Before touching code, identify which of these 4 arteries are touched:

```
Artery 1: Student Profile & Career Dossier (`profiles/{userId}`)
   ├── Read by: StudentsDirectory, StudentProfileDrawer, PlacementDrives (Eligibility), AccreditationReports (NAAC 5.2.1)
   ├── Fields: placementStatus (Enum), resumeVerified (Boolean), cgpa, branch, batch
   └── LAW: Decoupled Placement Status. Changing placementStatus NEVER wipes or mutates resumeVerified.

Artery 2: Resume Vault & Digital Seal (`resume_vault/{resumeId}`)
   ├── Flow: StudentVaultPage (Submit) -> ResumeVault (TPO Review) -> Cloud Function `verifyResume` -> QR Minting (`SEC-QR-...`) -> Public Verification (`/verify/:token`) -> Recruiter ZIP Export
   └── LAW: Version numbering must be strictly monotonically computed and synchronized between toast and card.

Artery 3: Multi-Tenant Role & Workspace Isolation (`AuthContext` & `CampusLayout`)
   ├── Personas: Student 🎓 vs TPO / Staff 🏢 vs Platform Admin ⚡
   └── LAW: Non-staff users must strictly evaluate to `isStudent = !isStaff`. Students MUST NEVER see administrative triggers ("Launch Sprint", "Auto-Enroll", "Verify & Stamp").

Artery 4: Backend Contract & Firestore Rules Boundary
   ├── Components: Frontend Services (`campusService.ts`, `tenantService.ts`) <-> Cloud Functions v2 (`functions/src/index.ts`) <-> `firestore.rules`
   └── LAW: Never rely on silent localStorage fallbacks when Firestore rules reject a query. Fix the rule or the query filter (`tenantId`).
```

---

## 2. 🔍 MANDATORY PRE-FIX BLAST-RADIUS CHECK (BEFORE WRITING CODE)

Before changing a single line of code:
1. **Find All Callers & Dependents**:
   - Use `grep_search` across `src/` and `functions/` for any modified function name, interface field, or Firestore collection path.
   - List the files that depend on this behavior in your thought process.
2. **Cross-Role Impact Analysis**:
   - Answer: *"If I change this for the Student, does it break or leak to the TPO?"*
   - Answer: *"If I change this for the TPO, does it break Student eligibility or NAAC export?"*
3. **Database Schema Parity**:
   - If updating a field in Firestore, verify that `firestore.rules` allows the write for that specific user role.

---

## 3. 🧪 MANDATORY POST-FIX VERIFICATION GATE (BEFORE DECLARING FIXED)

You may ONLY tell the user a bug is resolved after verifying:
1. **Automated Unit Tests**:
   - Run `npm test`. All 26 test suites (201+ tests) must pass with 0 failures.
2. **Staging Build Check**:
   - Run `npm run build:staging`. The Vite build must compile with 0 TypeScript and 0 Rollup bundling errors.
3. **Live Dual-Role Check (Playwright / Browser Subagent)**:
   - For UI or workflow fixes, verify both the Student persona (`ishayadav106@gmail.com`) and TPO persona (`sovanbarik07@gmail.com`).
4. **Permanent Memory Entry**:
   - Append an entry to `CHANGELOG.md` with: Date/Time (UTC & IST), Root Cause (file + line), Blast Radius checked, and Rollback Command.
   - Update the Memory MCP server if an architectural pattern was altered.

---

## 4. 🚫 FORBIDDEN SHORTCUTS
- ❌ **Swallowing Errors**: Never add empty `catch(e) {}` blocks to hide failing promises.
- ❌ **Silent Fallback Trap**: Never replace a failing Firestore query with hardcoded dummy arrays without surfacing the Firestore rule or network issue.
- ❌ **Unsolicited Refactoring**: Touch ONLY what is directly required to resolve the bug. Never rename or reorganize unrelated components.
