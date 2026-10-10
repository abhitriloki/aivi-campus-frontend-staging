"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_ADMIN_ALLOWLIST = exports.DEMO_TENANT_ID = void 0;
exports.runDemoSeeder = runDemoSeeder;
exports.runDemoReset = runDemoReset;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const pdf_lib_1 = require("pdf-lib");
const qrcode_1 = __importDefault(require("qrcode"));
exports.DEMO_TENANT_ID = "demo-sunrise";
const DEMO_DOMAIN = "demo.aivilabs.com";
// Platform admin email allowlist
exports.PLATFORM_ADMIN_ALLOWLIST = ["abhi.triloki@gmail.com"];
const INDIAN_FIRST_NAMES = [
    "Aarav", "Aditi", "Ananya", "Arjun", "Dev", "Divya", "Ishan", "Kavya",
    "Manish", "Neha", "Nikhil", "Pooja", "Priya", "Rahul", "Rohan", "Riya",
    "Siddharth", "Sneha", "Tanvi", "Utkarsh", "Vipul", "Yash", "Aditya", "Bhavna",
    "Chaitanya", "Deepak", "Gaurav", "Harsh", "Ishita", "Jyoti", "Karan", "Megha",
];
const INDIAN_LAST_NAMES = [
    "Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Joshi", "Mishra",
    "Yadav", "Tripathi", "Srivastava", "Chaudhary", "Reddy", "Nair", "Rao", "Agarwal",
];
const BRANCHES = ["CSE", "ECE", "ME"];
/**
 * Generates valid minimal resume PDF bytes with optional QR seal stamp
 */
async function generateDemoResumePdf(studentName, enrollmentNo, branch, isVerified) {
    const pdfDoc = await pdf_lib_1.PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const font = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
    page.drawRectangle({
        x: 0,
        y: 791.89,
        width: 595.28,
        height: 50,
        color: (0, pdf_lib_1.rgb)(0.086, 0.611, 0.56),
    });
    page.drawText("SUNRISE ENGINEERING COLLEGE, LUCKNOW", {
        x: 20,
        y: 810,
        size: 14,
        font: boldFont,
        color: (0, pdf_lib_1.rgb)(1, 1, 1),
    });
    page.drawText(`VERIFIED STUDENT RESUME VAULT — ${branch} BATCH 2026`, {
        x: 20,
        y: 770,
        size: 11,
        font: boldFont,
        color: (0, pdf_lib_1.rgb)(0.1, 0.1, 0.1),
    });
    page.drawText(`Candidate: ${studentName}`, { x: 20, y: 740, size: 12, font: boldFont });
    page.drawText(`Enrollment No: ${enrollmentNo} | Branch: ${branch}`, { x: 20, y: 720, size: 10, font });
    page.drawText("TECHNICAL SKILLS & EXPERIENCE", { x: 20, y: 680, size: 12, font: boldFont });
    page.drawText("• Languages: Data Structures & Algorithms, Java, Python, SQL, React, Node.js", { x: 20, y: 660, size: 10, font });
    page.drawText("• Projects: AI Career Intelligence OS, Automated Placement Drive System", { x: 20, y: 645, size: 10, font });
    if (isVerified) {
        const qrData = `https://aivilabs.com/verify/${enrollmentNo}?tenant=demo-sunrise`;
        const qrDataUrl = await qrcode_1.default.toDataURL(qrData, { margin: 1, width: 100 });
        const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
        const qrImage = await pdfDoc.embedPng(qrImageBytes);
        page.drawImage(qrImage, {
            x: 450,
            y: 690,
            width: 90,
            height: 90,
        });
        page.drawText("VERIFIED BY TPO", {
            x: 452,
            y: 678,
            size: 8,
            font: boldFont,
            color: (0, pdf_lib_1.rgb)(0, 0.5, 0.2),
        });
    }
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
/**
 * Updates job progress in demo_seed_jobs collection
 */
async function updateJobProgress(db, jobId, step, pct, counts, status = "running", errorMessage) {
    await db.collection("demo_seed_jobs").doc(jobId).set({
        jobId,
        tenantId: exports.DEMO_TENANT_ID,
        step,
        pct,
        counts,
        status,
        errorMessage: errorMessage || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
}
/**
 * Runs the full end-to-end 1-click Demo Campus Seeder
 */
async function runDemoSeeder(db, auth, jobId, confirmExisting) {
    const counts = {
        users: 0,
        profiles: 0,
        scores: 0,
        analysisResults: 0,
        drives: 0,
        applications: 0,
        resumes: 0,
        interviews: 0,
    };
    // Check if tenant already exists
    const tenantRef = db.collection("tenants").doc(exports.DEMO_TENANT_ID);
    const tenantSnap = await tenantRef.get();
    if (tenantSnap.exists && !confirmExisting) {
        await updateJobProgress(db, jobId, "Refused: existing demo campus", 0, counts, "failed", "Demo campus already exists. Pass confirmExisting: true to overwrite.");
        return { status: "exists_confirmation_required", message: "Demo campus already exists." };
    }
    await updateJobProgress(db, jobId, "Initializing tenant & staff accounts...", 5, counts);
    // 1. Provision Tenant Document
    await tenantRef.set({
        name: "Sunrise Engineering College, Lucknow",
        code: exports.DEMO_TENANT_ID,
        plan: "pro",
        seats: 3000,
        seatsUsed: 242,
        academicYear: "2025-26",
        isDemo: true,
        seeded: true,
        active: true,
        branding: {
            primaryColor: "#169C8F",
            accentColor: "#FF6D4A",
            logoUrl: "",
            loginHeadline: "Sunrise Engineering College TPO Command Center",
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // 2. Provision Staff Accounts (TPO Director & CSE Coordinator)
    const staffAccounts = [
        { email: `tpo.director@${DEMO_DOMAIN}`, name: "Dr. Alok Verma", role: "tenant_admin", branchScope: [] },
        { email: `coordinator.cse@${DEMO_DOMAIN}`, name: "Prof. Sunita Rao", role: "coordinator", branchScope: ["CSE"] },
    ];
    for (const staff of staffAccounts) {
        let uid;
        try {
            const userRecord = await auth.getUserByEmail(staff.email);
            uid = userRecord.uid;
            await auth.updateUser(uid, {
                password: "DemoUser@2026",
                displayName: staff.name,
                emailVerified: true,
            });
        }
        catch {
            const created = await auth.createUser({
                email: staff.email,
                password: "DemoUser@2026",
                displayName: staff.name,
                emailVerified: true,
            });
            uid = created.uid;
        }
        await auth.setCustomUserClaims(uid, { tenantId: exports.DEMO_TENANT_ID, role: staff.role });
        await db.collection("profiles").doc(uid).set({
            userId: uid,
            tenantId: exports.DEMO_TENANT_ID,
            role: staff.role,
            fullName: staff.name,
            email: staff.email,
            branchScope: staff.branchScope,
            seeded: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        counts.users++;
    }
    await updateJobProgress(db, jobId, "Generating 240 student profiles...", 25, counts);
    // 3. Generate 240 Students across CSE(96), ECE(72), ME(72)
    const studentRecords = [];
    let studentIndex = 1;
    const branchCounts = { CSE: 96, ECE: 72, ME: 72 };
    for (const branch of BRANCHES) {
        const totalForBranch = branchCounts[branch];
        for (let i = 0; i < totalForBranch; i++) {
            const fn = INDIAN_FIRST_NAMES[(studentIndex * 7) % INDIAN_FIRST_NAMES.length];
            const ln = INDIAN_LAST_NAMES[(studentIndex * 13) % INDIAN_LAST_NAMES.length];
            const fullName = `${fn} ${ln}`;
            const email = `student${studentIndex}@${DEMO_DOMAIN}`;
            const batch = i < totalForBranch * 0.7 ? "2026" : "2027";
            const enrollmentNo = `SEC${batch.slice(2)}${branch}${String(i + 1).padStart(3, "0")}`;
            // Realistic CGPA distribution (5.2 - 9.6)
            const hasCgpaGap = studentIndex <= 17; // 17 missing CGPA
            const cgpa = hasCgpaGap ? 0 : Number((5.2 + Math.random() * 4.4).toFixed(1));
            // Realistic AES distribution (25% <40, 35% 40-60, 28% 60-75, 12% 75+)
            let aes = 45;
            const r = (studentIndex * 17) % 100;
            if (r < 25)
                aes = Math.floor(25 + Math.random() * 14); // <40
            else if (r < 60)
                aes = Math.floor(40 + Math.random() * 20); // 40-60
            else if (r < 88)
                aes = Math.floor(60 + Math.random() * 15); // 60-75
            else
                aes = Math.floor(75 + Math.random() * 20); // 75+
            // Placement status: 46 placed, 8 higher_studies, 9 missing
            let placementStatus = "unplaced";
            if (studentIndex <= 46)
                placementStatus = "placed";
            else if (studentIndex <= 54)
                placementStatus = "higher_studies";
            else if (studentIndex <= 63)
                placementStatus = ""; // 9 missing gap
            const dpdpOptOut = studentIndex % 12 === 0; // 8% opt-out
            let uid;
            try {
                const existingUser = await auth.getUserByEmail(email);
                uid = existingUser.uid;
            }
            catch {
                const created = await auth.createUser({
                    email,
                    password: "DemoStudent@2026",
                    displayName: fullName,
                    emailVerified: true,
                });
                uid = created.uid;
            }
            await auth.setCustomUserClaims(uid, { tenantId: exports.DEMO_TENANT_ID, role: "student" });
            // Profile Document
            await db.collection("profiles").doc(uid).set({
                userId: uid,
                tenantId: exports.DEMO_TENANT_ID,
                role: "student",
                fullName,
                email,
                enrollmentNo,
                branch,
                academicYear: "2025-26",
                graduationYear: Number(batch),
                cgpa: cgpa > 0 ? cgpa : null,
                placementStatus: placementStatus || null,
                dpdpConsent: !dpdpOptOut,
                seeded: true,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            // Employability Score Document
            await db.collection("employability_scores").doc(uid).set({
                userId: uid,
                tenantId: exports.DEMO_TENANT_ID,
                aes,
                components: {
                    ats: aes > 50 ? 82 : 45,
                    jdFit: aes > 50 ? 78 : 38,
                    interview: aes > 50 ? 75 : 40,
                },
                seeded: true,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            studentRecords.push({ uid, fullName, email, enrollmentNo, branch, cgpa, aes, placementStatus });
            studentIndex++;
            counts.students++;
            counts.profiles++;
            counts.scores++;
        }
    }
    await updateJobProgress(db, jobId, "Generating placement drives & sprints...", 50, counts);
    // 4. Create Placement Drives & Sprints
    const driveA = await db.collection("placement_drives").add({
        tenantId: exports.DEMO_TENANT_ID,
        company: "TCS Ninja 2026",
        roleTitle: "Systems Engineer",
        minCgpa: 6.5,
        maxBacklogs: 1,
        allowedBranches: ["CSE", "ECE"],
        ctc: 3.6,
        status: "published",
        shortlistCount: 38,
        seeded: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    counts.drives++;
    const driveB = await db.collection("placement_drives").add({
        tenantId: exports.DEMO_TENANT_ID,
        company: "Wipro Elite 2026",
        roleTitle: "Project Engineer",
        minCgpa: 6.0,
        maxBacklogs: 2,
        allowedBranches: ["CSE", "ECE", "ME"],
        ctc: 4.2,
        status: "completed",
        shortlistCount: 54,
        seeded: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    counts.drives++;
    // 5. Seed Applications for Wipro Elite (18 offers)
    for (let i = 0; i < 54; i++) {
        const st = studentRecords[i];
        const outcome = i < 18 ? "offer" : i < 35 ? "selected" : "rejected";
        await db.collection("drive_applications").add({
            tenantId: exports.DEMO_TENANT_ID,
            driveId: driveB.id,
            userId: st.uid,
            studentName: st.fullName,
            enrollmentNo: st.enrollmentNo,
            branch: st.branch,
            cgpa: st.cgpa || 7.2,
            eligible: true,
            stageIndex: 3,
            outcome,
            offerCtc: outcome === "offer" ? 4.2 : undefined,
            seeded: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        counts.applications++;
    }
    await updateJobProgress(db, jobId, "Seeding Resume Vault & generating verified PDFs...", 75, counts);
    // 6. Seed Resume Vault (100 resumes: 60 verified, 12 submitted, 8 changes_requested, 20 draft)
    for (let i = 0; i < 100; i++) {
        const st = studentRecords[i];
        let status = "draft";
        if (i < 60)
            status = "verified";
        else if (i < 72)
            status = "submitted";
        else if (i < 80)
            status = "changes_requested";
        const isVerified = status === "verified";
        const pdfBuffer = await generateDemoResumePdf(st.fullName, st.enrollmentNo, st.branch, isVerified);
        const pdfBase64 = pdfBuffer.toString("base64");
        await db.collection("resume_vault").add({
            tenantId: exports.DEMO_TENANT_ID,
            userId: st.uid,
            studentName: st.fullName,
            enrollmentNo: st.enrollmentNo,
            branch: st.branch,
            status,
            verificationQr: isVerified ? `https://aivilabs.com/verify/${st.enrollmentNo}?tenant=demo-sunrise` : null,
            pdfBase64,
            seeded: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        counts.resumes++;
    }
    await updateJobProgress(db, jobId, "Seeding Vernacular AI Mock Interviews & Daily Stats...", 90, counts);
    // 7. Seed 35 Mock Interview Sessions
    for (let i = 0; i < 35; i++) {
        const st = studentRecords[i];
        const language = i < 15 ? "hi" : i < 27 ? "hinglish" : "en";
        await db.collection("mock_interviews").add({
            tenantId: exports.DEMO_TENANT_ID,
            userId: st.uid,
            studentName: st.fullName,
            enrollmentNo: st.enrollmentNo,
            branch: st.branch,
            language,
            overallScore: Math.floor(65 + Math.random() * 30),
            facultyReviewFlagged: i < 3,
            seeded: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        counts.interviews++;
    }
    // 8. Backfill tenant_daily_stats
    await db.collection("tenant_daily_stats").add({
        tenantId: exports.DEMO_TENANT_ID,
        date: new Date().toISOString().split("T")[0],
        activeStudents7d: 184,
        activeStudents30d: 228,
        avgAes: 58.4,
        aesBands: { "<40": 60, "40-60": 84, "60-75": 67, "75+": 29 },
        byBranch: {
            CSE: { students: 96, avgAes: 64.2, active7d: 82, verifiedResumes: 35, interviewsDone: 22, placed: 24 },
            ECE: { students: 72, avgAes: 56.8, active7d: 58, verifiedResumes: 18, interviewsDone: 9, placed: 14 },
            ME: { students: 72, avgAes: 51.5, active7d: 44, verifiedResumes: 7, interviewsDone: 4, placed: 8 },
        },
        seatsUsed: 242,
        seeded: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await updateJobProgress(db, jobId, "Demo Campus Seeding Complete!", 100, counts, "completed");
    return { status: "completed", counts };
}
/**
 * Hard-deletes all demo tenant data where tenantId == "demo-sunrise" and seeded == true
 */
async function runDemoReset(db, auth, confirmPhrase) {
    if (confirmPhrase !== "DELETE DEMO") {
        throw new https_1.HttpsError("invalid-argument", "Invalid confirmPhrase. Must equal 'DELETE DEMO'.");
    }
    const collectionsToDelete = [
        "profiles",
        "employability_scores",
        "placement_drives",
        "drive_applications",
        "resume_vault",
        "mock_interviews",
        "tenant_daily_stats",
        "audit_logs",
    ];
    let deletedCount = 0;
    for (const collName of collectionsToDelete) {
        const snap = await db.collection(collName).where("tenantId", "==", exports.DEMO_TENANT_ID).get();
        const batch = db.batch();
        snap.docs.forEach((doc) => {
            batch.delete(doc.ref);
            deletedCount++;
        });
        if (!snap.empty) {
            await batch.commit();
        }
    }
    // Delete Tenant document
    await db.collection("tenants").doc(exports.DEMO_TENANT_ID).delete().catch(() => { });
    // Clean up Auth Users
    const staffEmails = [`tpo.director@${DEMO_DOMAIN}`, `coordinator.cse@${DEMO_DOMAIN}`];
    for (const email of staffEmails) {
        try {
            const u = await auth.getUserByEmail(email);
            await auth.deleteUser(u.uid);
        }
        catch { }
    }
    return { status: "deleted", deletedDocsCount: deletedCount };
}
//# sourceMappingURL=demoSeeder.js.map