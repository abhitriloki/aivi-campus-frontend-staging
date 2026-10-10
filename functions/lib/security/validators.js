"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestResumeChangesSchema = exports.verifyResumeSchema = exports.submitVaultResumeSchema = exports.updateStudentPlacementStatusSchema = exports.recordDriveOutcomeSchema = exports.getTrackAnalyticsSchema = exports.createSprintTrackSchema = exports.markSprintTaskDoneSchema = exports.enrollInSprintSchema = exports.generateDriveSprintSchema = exports.computeDriveShortlistSchema = exports.publishDriveSchema = exports.updateDriveSchema = exports.createDriveSchema = exports.parseDriveJdSchema = exports.nudgeStudentSchema = exports.aggregateTenantStatsSchema = exports.backfillAesSchema = exports.reassignTenantAdminSchema = exports.listTenantsPublicSchema = exports.getTenantStaffSchema = exports.deactivateStaffSchema = exports.inviteCoordinatorSchema = exports.acceptDpdpConsentSchema = exports.getTenantBrandingSchema = exports.rollbackImportJobSchema = exports.deleteCampusStudentSchema = exports.addCampusStudentSchema = exports.getCampusStudentsSchema = exports.getImportJobSchema = exports.importStudentsCsvSchema = exports.getMyTenantContextSchema = exports.setTenantClaimsSchema = exports.setTenantRoleSchema = exports.provisionTenantSchema = exports.TENANT_SLUG_REGEX = exports.RESERVED_SLUGS_SET = exports.RESERVED_SLUGS = exports.createPaymentOrderSchema = exports.contactFormSchema = exports.linkedinOptimizeSchema = exports.linkedinAnalyzeSchema = exports.adminUpdateUserSchema = exports.extractPdfSchema = exports.saveAnalysisResultSchema = exports.careerAnalysisSchema = exports.applyCouponSchema = exports.exchangeLinkedInCodeSchema = exports.checkUsageSchema = exports.analysisTypeSchema = void 0;
exports.sendAuthPasswordResetEmailSchema = exports.sendAuthVerificationEmailSchema = exports.resetDemoCampusSchema = exports.getDemoSeedJobSchema = exports.seedDemoCampusSchema = exports.archiveGraduatedBatchSchema = exports.purgeTenantDataSchema = exports.exportStateGovReadinessSchema = exports.generateTenantApiKeySchema = exports.exportAuditLogsSchema = exports.generateParentProgressReportSchema = exports.getEventIcsFileSchema = exports.createCampusEventSchema = exports.markAnnouncementReadSchema = exports.createAnnouncementSchema = exports.updateTenantBrandingSchema = exports.toggleTenantStatusSchema = exports.updateTenantPlanSchema = exports.markInvoicePaidSchema = exports.generateTenantInvoiceSchema = exports.nudgeIncompleteProfileStudentsSchema = exports.generateAccreditationReportSchema = exports.adjustFacultyInterviewScoreSchema = exports.seedCompanyQuestionPacksSchema = exports.requestCompanyPackSchema = exports.generateCustomQuestionPackSchema = exports.generateQuestionBankSchema = exports.provisionSsoUserSchema = exports.realtimeVoiceNextTurnSchema = exports.evaluateRealtimeVoiceSessionSchema = exports.startRealtimeVoiceSessionSchema = exports.voiceInterviewTurnSchema = exports.finishMockInterviewSchema = exports.answerMockInterviewTurnSchema = exports.startMockInterviewSchema = exports.getExportJobSchema = exports.generateDriveResumePackSchema = exports.exportResumePackageSchema = exports.getResumeSignedUrlSchema = void 0;
exports.validatePreNormalizedDomain = validatePreNormalizedDomain;
exports.normalizeDomain = normalizeDomain;
exports.validateNormalizedDomain = validateNormalizedDomain;
exports.parseOrThrow = parseOrThrow;
const https_1 = require("firebase-functions/v2/https");
const zod_1 = require("zod");
exports.analysisTypeSchema = zod_1.z.enum([
    "resume",
    "job_fit",
    "roadmap",
    "interview",
    "promotion",
    "portfolio",
    "resume_rebuild",
    "linkedin_analyze",
    "linkedin_optimize",
]);
const safeText = (max) => zod_1.z.string().trim().min(1).max(max);
const optionalText = (max) => zod_1.z.string().trim().max(max).nullable().optional();
exports.checkUsageSchema = zod_1.z.object({
    analysisType: exports.analysisTypeSchema,
}).strict();
exports.exchangeLinkedInCodeSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(1).max(2000),
    redirectUri: zod_1.z.string().trim().url(),
}).strict();
exports.applyCouponSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(1).max(40).transform((value) => value.toUpperCase()),
}).strict();
exports.careerAnalysisSchema = zod_1.z.object({
    analysis_type: exports.analysisTypeSchema,
    resume_text: optionalText(120000),
    job_description: optionalText(80000),
    projects: zod_1.z.array(zod_1.z.object({
        name: safeText(200),
        description: safeText(8000),
    })).max(25).optional(),
    current_role: optionalText(200),
    target_role: optionalText(200),
    missing_skills: zod_1.z.object({
        critical: zod_1.z.array(zod_1.z.string().trim().max(300)).max(50).default([]),
        moderate: zod_1.z.array(zod_1.z.string().trim().max(300)).max(50).default([]),
        minor: zod_1.z.array(zod_1.z.string().trim().max(300)).max(50).default([]),
    }).optional(),
});
exports.saveAnalysisResultSchema = zod_1.z.object({
    analysisType: exports.analysisTypeSchema,
    result: zod_1.z.unknown(),
    scores: zod_1.z.unknown().optional(),
    contentHash: zod_1.z.string().trim().max(128).nullable().optional(),
}).strict();
exports.extractPdfSchema = zod_1.z.object({
    pdf_base64: zod_1.z.string().min(100).max(12000000),
}).strict();
exports.adminUpdateUserSchema = zod_1.z.object({
    targetUserId: zod_1.z.string().trim().min(1).max(128),
    role: zod_1.z.enum(["admin", "user"]).optional(),
    planType: zod_1.z.enum(["free", "starter", "pro"]).optional(),
    resetQuota: zod_1.z.boolean().optional(),
}).strict();
exports.linkedinAnalyzeSchema = zod_1.z.object({
    profileText: safeText(80000),
}).strict();
exports.linkedinOptimizeSchema = zod_1.z.object({
    analysisId: zod_1.z.string().trim().min(1).max(160),
    targetRole: optionalText(200),
    industry: optionalText(200),
}).strict();
exports.contactFormSchema = zod_1.z.object({
    name: safeText(100),
    email: zod_1.z.string().trim().email().max(255),
    subject: safeText(200),
    message: safeText(2000),
    type: zod_1.z.enum(["general", "campus_demo"]).optional().default("general"),
    designation: optionalText(150),
    institution: optionalText(200),
    city: optionalText(100),
    phone: optionalText(30),
    studentStrength: optionalText(50),
    utm: zod_1.z.object({
        source: optionalText(100),
        medium: optionalText(100),
        campaign: optionalText(100),
    }).optional(),
}).strict();
exports.createPaymentOrderSchema = zod_1.z.object({
    planType: zod_1.z.enum(["starter", "pro"]),
}).strict();
exports.RESERVED_SLUGS = [
    "www",
    "admin",
    "api",
    "app",
    "auth",
    "login",
    "logout",
    "support",
    "staging",
    "demo",
    "campus",
    "platform-admin",
    "campus-admin",
    "tpo",
    "student",
    "recruiter",
    "static",
    "assets",
    "mail",
    "status",
    "help",
    "docs",
    "billing",
    "system",
    "root",
];
exports.RESERVED_SLUGS_SET = new Set(exports.RESERVED_SLUGS);
exports.TENANT_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/**
 * Validates whether a raw domain input is an unambiguous hostname string BEFORE normalization.
 * Rejects inputs containing:
 * - URL schemes (http://, https://, ftp://, etc.)
 * - Paths (/), query strings (?), hashes (#)
 * - User info / email symbols (@)
 * - Ports (:8080, :443)
 * - Wildcards (*)
 * - Internal/embedded whitespace (spaces, tabs, newlines)
 */
function validatePreNormalizedDomain(rawDomain) {
    if (!rawDomain) {
        return { valid: false, reason: "Domain cannot be empty" };
    }
    // Check for internal whitespace (leading/trailing whitespace is trimmed by caller)
    const trimmed = rawDomain.trim();
    if (/\s/.test(trimmed)) {
        return { valid: false, reason: "Domain cannot contain internal whitespace" };
    }
    // Reject URL schemes
    if (/^[a-z0-9+.-]+:\/\//i.test(trimmed)) {
        return { valid: false, reason: "Domain must be a hostname only, not a URL with scheme" };
    }
    // Reject path, query, fragment
    if (trimmed.includes("/") || trimmed.includes("?") || trimmed.includes("#")) {
        return { valid: false, reason: "Domain cannot contain paths, query parameters, or fragments" };
    }
    // Reject user info / email
    if (trimmed.includes("@")) {
        return { valid: false, reason: "Domain cannot contain user info or email characters (@)" };
    }
    // Reject port
    if (trimmed.includes(":")) {
        return { valid: false, reason: "Domain cannot contain port numbers" };
    }
    // Reject wildcards
    if (trimmed.includes("*")) {
        return { valid: false, reason: "Wildcard domains are not permitted" };
    }
    return { valid: true };
}
/**
 * Normalizes an unambiguous hostname to canonical format:
 * - Trims outer whitespace
 * - Lowercases
 * - Processes single trailing DNS root dot (FQDN root notation)
 * - Processes leading 'www.' according to canonical-domain policy
 */
function normalizeDomain(rawDomain) {
    if (!rawDomain)
        return "";
    let d = rawDomain.trim().toLowerCase();
    // Process one trailing DNS root dot according to documented FQDN policy
    if (d.endsWith(".")) {
        d = d.slice(0, -1);
    }
    // Process leading www. according to documented canonical-domain policy
    if (d.startsWith("www.")) {
        d = d.slice(4);
    }
    return d.trim();
}
/**
 * Validates a normalized domain according to production RFC 1035 / RFC 1123 hostname rules.
 *
 * POLICY ON INTERNATIONALIZED DOMAIN NAMES (IDN) AND PUNYCODE:
 * - Direct Unicode/non-ASCII characters are deliberately REJECTED at this boundary.
 * - If an internationalized domain is used, it MUST be registered and provisioned in its
 *   standard ASCII-compatible encoding (Punycode / ACE) starting with `xn--`
 *   (e.g. `xn--mgbh0fb.org`).
 * - Raw Unicode domains are NOT silently transformed to prevent homograph phishing
 *   and unexpected routing/TLS mismatch.
 */
function validateNormalizedDomain(domain) {
    if (!domain) {
        return { valid: false, reason: "Domain cannot be empty" };
    }
    // Maximum total hostname length per RFC 1035/1123 is 253 characters
    if (domain.length > 253) {
        return { valid: false, reason: "Domain length cannot exceed 253 characters" };
    }
    // Must not contain email addresses, URLs, protocols, paths, query strings, or ports
    if (domain.includes("@")) {
        return { valid: false, reason: "Domain cannot be an email address" };
    }
    if (domain.includes(":") || domain.includes("/") || domain.includes("?") || domain.includes("#")) {
        return { valid: false, reason: "Domain cannot contain paths, ports, or query parameters" };
    }
    if (domain.includes("*")) {
        return { valid: false, reason: "Wildcard domains are not permitted" };
    }
    if (domain.includes("_")) {
        return { valid: false, reason: "Domain labels cannot contain underscores" };
    }
    // Disallow localhost and loopback/private IP addresses
    if (domain === "localhost" || domain.endsWith(".localhost") || domain.endsWith(".local") || domain.endsWith(".internal")) {
        return { valid: false, reason: "Localhost and internal domains are not permitted" };
    }
    // Disallow IPv4 / IPv6 addresses
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipv4Regex.test(domain) || domain.includes("[")) {
        return { valid: false, reason: "IP addresses cannot be used as tenant domains" };
    }
    // Must contain at least two labels (e.g. college.edu or campus.univ.ac.in)
    const labels = domain.split(".");
    if (labels.length < 2) {
        return { valid: false, reason: "Domain must contain at least a second-level domain and a valid TLD" };
    }
    const labelRegex = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
    for (const label of labels) {
        if (!label) {
            return { valid: false, reason: "Domain cannot contain empty labels or consecutive dots" };
        }
        if (label.length > 63) {
            return { valid: false, reason: "Domain label cannot exceed 63 characters" };
        }
        if (label.startsWith("-") || label.endsWith("-")) {
            return { valid: false, reason: "Domain label cannot start or end with a hyphen" };
        }
        if (!labelRegex.test(label)) {
            return { valid: false, reason: `Invalid domain label '${label}': must consist of lowercase alphanumeric characters and internal hyphens` };
        }
    }
    // TLD must be at least 2 characters and cannot be all-numeric
    const tld = labels[labels.length - 1];
    if (tld.length < 2 || /^[0-9]+$/.test(tld)) {
        return { valid: false, reason: `Invalid top-level domain '${tld}'` };
    }
    return { valid: true };
}
exports.provisionTenantSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(3, "Slug must be at least 3 characters").max(63, "Slug must be at most 63 characters")
        .regex(exports.TENANT_SLUG_REGEX, "Slug must contain only lowercase alphanumeric characters separated by single hyphens, with no leading or trailing hyphens")
        .refine((val) => !exports.RESERVED_SLUGS_SET.has(val.toLowerCase()), {
        message: "This tenant slug is reserved and cannot be used",
    }).optional(),
    domain: zod_1.z.string().trim().min(1).max(255).optional(),
    name: zod_1.z.string().trim().min(2).max(200),
    type: zod_1.z.enum(["college", "university", "group"]).optional().default("college"),
    plan: zod_1.z.enum(["trial", "starter", "growth", "pro", "university"]).optional().default("starter"),
    seats: zod_1.z.number().int().positive().max(500000).optional(),
    maxSeats: zod_1.z.number().int().positive().max(500000).optional(),
    state: zod_1.z.string().trim().max(100).optional(),
    city: zod_1.z.string().trim().max(100).optional(),
    address: zod_1.z.string().trim().max(300).optional(),
    gstin: zod_1.z.string().trim().max(30).optional(),
    pinCode: zod_1.z.string().trim().max(10).optional(),
    adminName: zod_1.z.string().trim().min(2).max(200).optional(),
    adminEmail: zod_1.z.string().trim().email().max(255),
    adminPassword: zod_1.z.string().min(6).max(128).optional(),
    idempotencyKey: zod_1.z.string().trim().min(16).max(128).optional(),
    modules: zod_1.z.array(zod_1.z.string().trim().max(50)).optional(),
    branding: zod_1.z.object({
        logoUrl: zod_1.z.string().trim().max(1000).optional(),
        primaryColor: zod_1.z.string().trim().max(30).optional(),
        loginHeadline: zod_1.z.string().trim().max(200).optional(),
    }).optional(),
    academicYear: zod_1.z.string().trim().max(50).optional(),
}).refine((raw) => {
    if (!raw.domain)
        return true;
    // Step 1: Pre-normalization check. Reject URLs, schemes, paths, queries, ports, wildcards, userinfo
    const preCheck = validatePreNormalizedDomain(raw.domain);
    if (!preCheck.valid)
        return false;
    // Step 2: Canonical normalization (trim, lowercase, trailing root dot, leading www.)
    const normalized = normalizeDomain(raw.domain);
    // Step 3: Strict RFC 1035/1123 hostname validation
    const result = validateNormalizedDomain(normalized);
    return result.valid;
}, {
    message: "Invalid tenant domain: must be a bare hostname (e.g. college.edu or campus.univ.ac.in), not a URL, path, email, or port",
    path: ["domain"],
}).transform((raw) => {
    let resolvedSlug;
    if (raw.code) {
        resolvedSlug = raw.code.toLowerCase();
    }
    else {
        const fallback = (raw.domain || raw.name || "tenant").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
        resolvedSlug = fallback || "tenant-slug";
    }
    const resolvedDomain = raw.domain ? normalizeDomain(raw.domain) : undefined;
    return {
        code: resolvedSlug,
        name: raw.name,
        type: raw.type || "college",
        plan: raw.plan || "starter",
        seats: raw.seats || raw.maxSeats || 1000,
        adminName: raw.adminName || `${raw.name} Director`,
        adminEmail: raw.adminEmail.toLowerCase().trim(),
        adminPassword: raw.adminPassword || "AiviCampus@2026",
        idempotencyKey: raw.idempotencyKey,
        domain: resolvedDomain,
        maxSeats: raw.maxSeats || raw.seats || 1000,
        state: raw.state || "Uttar Pradesh",
        city: raw.city || "Lucknow",
        address: raw.address || "",
        gstin: raw.gstin || "",
        pinCode: raw.pinCode || "",
        modules: raw.modules || ["placement_drives", "resume_intelligence", "interview_prep"],
        branding: raw.branding,
        academicYear: raw.academicYear || "2025-2026",
    };
});
exports.setTenantRoleSchema = zod_1.z.object({
    targetUid: zod_1.z.string().trim().min(1).max(128),
    role: zod_1.z.enum(["tenant_admin", "coordinator"]),
    branchScope: zod_1.z.array(zod_1.z.string().trim().max(100)).optional(),
    tenantId: zod_1.z.string().trim().min(1).optional(),
}).strict();
exports.setTenantClaimsSchema = zod_1.z.object({
    targetUid: zod_1.z.string().trim().min(1).max(128),
    tenant_id: zod_1.z.string().trim().min(1).max(128),
    role: zod_1.z.enum(["student", "tenant_admin", "coordinator", "platform_admin"]).default("student"),
}).strict();
exports.getMyTenantContextSchema = zod_1.z.object({}).optional();
exports.importStudentsCsvSchema = zod_1.z.object({
    csvBase64: zod_1.z.string().min(10).max(15000000),
    columnMap: zod_1.z.record(zod_1.z.string(), zod_1.z.string().trim().max(100)),
    dryRun: zod_1.z.boolean().default(true),
    jobId: zod_1.z.string().trim().max(128).optional(),
}).strict();
exports.getImportJobSchema = zod_1.z.object({
    jobId: zod_1.z.string().trim().min(1).max(128),
}).strict();
exports.getCampusStudentsSchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    pageSize: zod_1.z.number().int().min(1).max(100).default(20),
    branch: zod_1.z.string().trim().max(100).optional(),
    batch: zod_1.z.number().int().min(1990).max(2100).optional(),
    status: zod_1.z.enum(["unplaced", "placed", "higher_studies", "entrepreneur", "not_seeking", "all"]).optional(),
    search: zod_1.z.string().trim().max(200).optional(),
    tenantId: zod_1.z.string().trim().min(1).optional(),
}).strict();
exports.addCampusStudentSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Student name is required").max(120),
    email: zod_1.z.string().trim().email("Valid institutional email is required"),
    enrollmentNo: zod_1.z.string().trim().min(1, "Enrollment number is required").max(60),
    branch: zod_1.z.string().trim().min(1, "Branch is required").max(60),
    batch: zod_1.z.preprocess((val) => typeof val === "string" ? parseInt(val, 10) : val, zod_1.z.number().int().min(1990).max(2100)),
    section: zod_1.z.string().trim().max(30).nullable().optional().or(zod_1.z.literal("")),
    phone: zod_1.z.string().trim().regex(/^(\+?[0-9\s-]{10,15})?$/, "Phone must be a valid 10-15 digit phone number").nullable().optional().or(zod_1.z.literal("")),
    cgpa: zod_1.z.preprocess((val) => (val === "" || val === null || val === undefined) ? undefined : typeof val === "string" ? parseFloat(val) : val, zod_1.z.number().min(0).max(10).optional()),
    tenantId: zod_1.z.string().trim().min(1).optional().or(zod_1.z.literal("")),
}).passthrough();
exports.deleteCampusStudentSchema = zod_1.z.object({
    studentId: zod_1.z.string().trim().min(1, "Student ID is required"),
    tenantId: zod_1.z.string().trim().min(1).optional(),
}).strict();
exports.rollbackImportJobSchema = zod_1.z.object({
    jobId: zod_1.z.string().trim().min(1, "Job ID is required"),
    tenantId: zod_1.z.string().trim().min(1).optional(),
}).strict();
exports.getTenantBrandingSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(1).max(50),
}).strict();
exports.acceptDpdpConsentSchema = zod_1.z.object({
    locale: zod_1.z.enum(["en", "hi"]).default("en"),
    version: zod_1.z.string().trim().default("v1.0"),
}).strict();
exports.inviteCoordinatorSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(100),
    email: zod_1.z.string().trim().email(),
    branchScope: zod_1.z.array(zod_1.z.string().trim().max(100)).optional().default([]),
}).strict();
exports.deactivateStaffSchema = zod_1.z.object({
    targetUid: zod_1.z.string().trim().min(1).max(128),
}).strict();
exports.getTenantStaffSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1).optional(),
}).optional();
exports.listTenantsPublicSchema = zod_1.z.object({}).optional();
exports.reassignTenantAdminSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1),
    adminEmail: zod_1.z.string().trim().email(),
    adminName: zod_1.z.string().trim().min(1),
    temporaryPassword: zod_1.z.string().trim().min(6).optional(),
}).strict();
exports.backfillAesSchema = zod_1.z.preprocess((val) => {
    if (typeof val === "number")
        return { batchSize: val };
    if (!val || typeof val !== "object")
        return {};
    return val;
}, zod_1.z.object({
    batchSize: zod_1.z.number().int().min(1).max(500).default(200),
    tenantId: zod_1.z.string().optional(),
}).passthrough());
exports.aggregateTenantStatsSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1).max(128).optional(),
}).strict();
exports.nudgeStudentSchema = zod_1.z.object({
    studentId: zod_1.z.string().trim().min(1).max(128),
}).strict();
exports.parseDriveJdSchema = zod_1.z.object({
    jdText: zod_1.z.string().trim().min(10, "JD text must be at least 10 characters"),
}).strict();
exports.createDriveSchema = zod_1.z.object({
    company: zod_1.z.string().trim().min(1),
    roleTitle: zod_1.z.string().trim().min(1),
    ctcText: zod_1.z.string().trim().min(1),
    jdText: zod_1.z.string().trim().min(10),
    jdParsed: zod_1.z.object({
        requiredSkills: zod_1.z.array(zod_1.z.string()).default([]),
        niceSkills: zod_1.z.array(zod_1.z.string()).default([]),
        minCgpa: zod_1.z.number().optional(),
        branchesHint: zod_1.z.array(zod_1.z.string()).default([]),
        responsibilities: zod_1.z.array(zod_1.z.string()).default([]),
    }).optional(),
    eligibility: zod_1.z.object({
        minCgpa: zod_1.z.number().optional(),
        maxBacklogs: zod_1.z.number().optional(),
        batches: zod_1.z.array(zod_1.z.string()).default([]),
        branches: zod_1.z.array(zod_1.z.string()).default([]),
    }).default({ batches: [], branches: [] }),
    stages: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        date: zod_1.z.string(),
        mode: zod_1.z.string().default("online"),
    })).default([]),
}).strict();
exports.updateDriveSchema = zod_1.z.object({
    driveId: zod_1.z.string().trim().min(1),
    updates: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
}).strict();
exports.publishDriveSchema = zod_1.z.object({
    driveId: zod_1.z.string().trim().min(1),
}).strict();
exports.computeDriveShortlistSchema = zod_1.z.object({
    driveId: zod_1.z.string().trim().min(1),
}).strict();
exports.generateDriveSprintSchema = zod_1.z.object({
    driveId: zod_1.z.string().trim().min(1),
    durationDays: zod_1.z.number().int().min(1).max(30).default(7),
}).strict();
exports.enrollInSprintSchema = zod_1.z.object({
    sprintId: zod_1.z.string().trim().min(1),
    onlyEligible: zod_1.z.boolean().optional(),
}).strict();
exports.markSprintTaskDoneSchema = zod_1.z.object({
    sprintId: zod_1.z.string().trim().min(1),
    taskId: zod_1.z.string().trim().min(1),
}).strict();
exports.createSprintTrackSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1),
    planTemplateId: zod_1.z.string().trim().min(1),
    target: zod_1.z.object({
        branch: zod_1.z.string().optional(),
        batch: zod_1.z.string().optional(),
        studentUids: zod_1.z.array(zod_1.z.string()).default([]),
    }).default({ studentUids: [] }),
    driveId: zod_1.z.string().optional(),
}).strict();
exports.getTrackAnalyticsSchema = zod_1.z.object({
    trackId: zod_1.z.string().trim().min(1),
}).strict();
exports.recordDriveOutcomeSchema = zod_1.z.object({
    driveId: zod_1.z.string().trim().min(1),
    userId: zod_1.z.string().trim().min(1),
    stageIndex: zod_1.z.number().int().min(0),
    outcome: zod_1.z.enum(["pending", "selected", "rejected", "offer"]),
    offerCtc: zod_1.z.number().nullable().optional(),
    packageLpa: zod_1.z.number().nullable().optional(),
    offerLetterUrl: zod_1.z.string().nullable().optional(),
    joiningDate: zod_1.z.string().nullable().optional(),
    rejectionReason: zod_1.z.enum(["technical_round", "hr_round", "aptitude", "declined_by_candidate", "other"]).nullable().optional(),
    rejectionNotes: zod_1.z.string().nullable().optional(),
}).strict();
exports.updateStudentPlacementStatusSchema = zod_1.z.object({
    studentUid: zod_1.z.string().trim().min(1),
    placementStatus: zod_1.z.enum(["placed", "unplaced", "higher_studies", "opted_out"]),
    placedCompany: zod_1.z.string().optional(),
    placedPackageLpa: zod_1.z.number().optional(),
}).strict();
exports.submitVaultResumeSchema = zod_1.z.object({
    resumeData: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
    analysisId: zod_1.z.string().optional(),
}).strict();
exports.verifyResumeSchema = zod_1.z.object({
    versionId: zod_1.z.string().trim().min(1),
}).strict();
exports.requestResumeChangesSchema = zod_1.z.object({
    versionId: zod_1.z.string().trim().min(1),
    reviewerNote: zod_1.z.string().trim().min(1, "Reviewer note required when requesting changes"),
}).strict();
exports.getResumeSignedUrlSchema = zod_1.z.object({
    versionId: zod_1.z.string().trim().min(1),
}).strict();
exports.exportResumePackageSchema = zod_1.z.object({
    filters: zod_1.z.object({
        batch: zod_1.z.string().optional(),
        branches: zod_1.z.array(zod_1.z.string()).optional(),
        driveId: zod_1.z.string().optional(),
        minAes: zod_1.z.number().optional(),
        onlyVerified: zod_1.z.boolean().optional(),
    }).optional(),
}).strict();
// P12: Drive-specific resume ZIP exporter (consent-filtered, cover sheet, 7-day URL, email)
exports.generateDriveResumePackSchema = zod_1.z.object({
    driveId: zod_1.z.string().trim().min(1, "Drive ID required"),
    // Explicit candidate selection — UIDs of students the TPO ticked
    selectedUserIds: zod_1.z.array(zod_1.z.string().min(1)).min(1, "Select at least one candidate").max(500, "Maximum 500 per pack"),
    // Optional recruiter email to CC the download link
    recruiterEmail: zod_1.z.string().email().nullable().optional().or(zod_1.z.literal("")),
    // Optional custom note for the cover sheet
    packNote: zod_1.z.string().max(300).nullable().optional(),
}).strict();
exports.getExportJobSchema = zod_1.z.object({
    exportId: zod_1.z.string().trim().min(1),
}).strict();
exports.startMockInterviewSchema = zod_1.z.object({
    mode: zod_1.z.enum(["hr", "technical", "mixed"]).optional().default("mixed"),
    language: zod_1.z.enum(["hi", "hinglish", "en"]).optional().default("hinglish"),
    roleContext: zod_1.z.string().nullable().optional(),
    driveId: zod_1.z.string().nullable().optional(),
    questionCount: zod_1.z.number().int().min(3).max(15).optional().default(6),
});
exports.answerMockInterviewTurnSchema = zod_1.z.object({
    sessionId: zod_1.z.string().trim().min(1),
    turnIndex: zod_1.z.number().int().min(0),
    audioBase64: zod_1.z.string().nullable().optional(),
    transcriptOverride: zod_1.z.string().nullable().optional(),
});
exports.finishMockInterviewSchema = zod_1.z.object({
    sessionId: zod_1.z.string().trim().min(1),
});
exports.voiceInterviewTurnSchema = zod_1.z.object({
    sessionId: zod_1.z.string().trim().min(1),
    turnIndex: zod_1.z.number().int().min(0),
    audioBase64: zod_1.z.string().min(1, "Audio data required"),
}).strict();
// ── P15: Real-Time Gemini Live Voice Session Schemas ─────────────────────────
exports.startRealtimeVoiceSessionSchema = zod_1.z.object({
    driveId: zod_1.z.string().nullable().optional(),
    personaId: zod_1.z.enum(["ananya", "vikram", "priya", "kabir", "custom"]).optional().default("vikram"),
    voiceId: zod_1.z.enum(["Aoede", "Fenrir", "Kore", "Puck"]).optional().default("Fenrir"),
    targetRole: zod_1.z.string().optional().default("Software Development Engineer"),
    company: zod_1.z.string().optional().default("Accenture"),
    jdText: zod_1.z.string().nullable().optional(),
    language: zod_1.z.enum(["en", "hi", "hinglish"]).optional().default("en"),
    strictness: zod_1.z.enum(["gentle", "realistic", "bar_raiser"]).optional().default("realistic"),
    customInstructions: zod_1.z.string().max(1000).optional(),
});
exports.evaluateRealtimeVoiceSessionSchema = zod_1.z.object({
    sessionId: zod_1.z.string().trim().min(1),
    transcript: zod_1.z.array(zod_1.z.object({
        role: zod_1.z.string(),
        text: zod_1.z.string(),
        timestamp: zod_1.z.number().optional(),
    })).min(1, "Transcript must have at least one turn"),
    targetRole: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    durationSeconds: zod_1.z.number().optional(),
});
exports.realtimeVoiceNextTurnSchema = zod_1.z.object({
    sessionId: zod_1.z.string().trim().min(1),
    transcript: zod_1.z.array(zod_1.z.object({
        role: zod_1.z.string(),
        text: zod_1.z.string(),
        timestamp: zod_1.z.number().optional(),
    })).min(1),
    company: zod_1.z.string().optional().default("Accenture"),
    targetRole: zod_1.z.string().optional().default("Software Engineer"),
    personaId: zod_1.z.enum(["ananya", "vikram", "priya", "kabir", "custom"]).optional().default("vikram"),
    language: zod_1.z.enum(["en", "hi", "hinglish"]).optional().default("en"),
    strictness: zod_1.z.enum(["gentle", "realistic", "bar_raiser"]).optional().default("realistic"),
    turnIndex: zod_1.z.number().int().min(1).default(1),
    currentPillar: zod_1.z.number().int().min(1).max(4).optional().default(1),
    pillarTurnsCount: zod_1.z.number().int().min(0).max(10).optional().default(0),
});
exports.provisionSsoUserSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1, "Tenant ID required"),
}).strict();
exports.generateQuestionBankSchema = zod_1.z.object({
    jdText: zod_1.z.string().trim().min(10, "Job description must be at least 10 characters long."),
    resumeText: zod_1.z.string().nullable().optional(),
    rounds: zod_1.z.array(zod_1.z.enum(["Behavioral", "Technical", "HR", "Aptitude Basics"])).min(1, "Select at least one round."),
    language: zod_1.z.enum(["en", "hi"]).optional().default("en"),
});
exports.generateCustomQuestionPackSchema = zod_1.z.object({
    companyName: zod_1.z.string().trim().min(2, "Company name is required."),
    roleTrack: zod_1.z.string().nullable().optional(),
});
exports.requestCompanyPackSchema = zod_1.z.object({
    companyName: zod_1.z.string().trim().min(2, "Company name is required."),
});
exports.seedCompanyQuestionPacksSchema = zod_1.z.object({
    forceReSeed: zod_1.z.boolean().optional().default(false),
});
exports.adjustFacultyInterviewScoreSchema = zod_1.z.object({
    sessionId: zod_1.z.string().trim().min(1),
    adjustedScore: zod_1.z.number().min(0).max(10),
    note: zod_1.z.string().trim().min(1, "Faculty review note is required"),
}).strict();
exports.generateAccreditationReportSchema = zod_1.z.object({
    academicYear: zod_1.z.string().trim().min(4),
    type: zod_1.z.enum(["naac_c5", "nirf", "bundle"]),
}).strict();
exports.nudgeIncompleteProfileStudentsSchema = zod_1.z.object({
    academicYear: zod_1.z.string().trim().min(4),
}).strict();
exports.generateTenantInvoiceSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1),
    mode: zod_1.z.enum(["online", "offline_po"]).default("offline_po"),
    poNumber: zod_1.z.string().optional(),
    poDate: zod_1.z.string().optional(),
    customerLegalName: zod_1.z.string().optional(),
    billingAddress: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    stateCode: zod_1.z.string().optional(),
    pinCode: zod_1.z.string().optional(),
    gstin: zod_1.z.string().optional(),
    isGstExempt: zod_1.z.boolean().optional(),
    attentionName: zod_1.z.string().optional(),
    planId: zod_1.z.string().optional(),
    seats: zod_1.z.number().optional(),
    externalPdfUrl: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
}).passthrough();
exports.markInvoicePaidSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().trim().min(1),
}).strict();
exports.updateTenantPlanSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1),
    plan: zod_1.z.enum(["trial", "starter", "growth", "pro", "university"]),
    maxSeats: zod_1.z.number().int().min(10),
}).strict();
exports.toggleTenantStatusSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1),
    status: zod_1.z.enum(["active", "suspended", "trial_expired"]),
}).strict();
exports.updateTenantBrandingSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1),
    branding: zod_1.z.object({
        logoUrl: zod_1.z.string().trim().optional(),
        primaryColor: zod_1.z.string().trim().optional(),
        accentColor: zod_1.z.string().trim().optional(),
        loginHeadline: zod_1.z.string().trim().optional(),
    }),
}).strict();
exports.createAnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(2),
    body: zod_1.z.string().trim().min(5),
    targetBatch: zod_1.z.string().default("ALL"),
    targetBranch: zod_1.z.string().default("ALL"),
    targetDriveId: zod_1.z.string().optional(),
}).strict();
exports.markAnnouncementReadSchema = zod_1.z.object({
    announcementId: zod_1.z.string().trim().min(1),
}).strict();
exports.createCampusEventSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(2),
    description: zod_1.z.string().trim(),
    eventType: zod_1.z.enum(["drive", "sprint_deadline", "workshop", "custom"]),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    location: zod_1.z.string().default("Campus TPO Cell"),
}).strict();
exports.getEventIcsFileSchema = zod_1.z.object({
    eventId: zod_1.z.string().trim().min(1),
}).strict();
exports.generateParentProgressReportSchema = zod_1.z.object({
    userId: zod_1.z.string().trim().min(1),
    locale: zod_1.z.enum(["hi", "en"]).default("en"),
}).strict();
exports.exportAuditLogsSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
}).strict();
exports.generateTenantApiKeySchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1),
    name: zod_1.z.string().trim().min(2),
}).strict();
exports.exportStateGovReadinessSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1),
    academicYear: zod_1.z.string().trim().min(4),
}).strict();
exports.purgeTenantDataSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1),
    confirmKey: zod_1.z.string().trim().min(6),
}).strict();
exports.archiveGraduatedBatchSchema = zod_1.z.object({
    tenantId: zod_1.z.string().trim().min(1),
    batch: zod_1.z.string().trim().min(4),
}).strict();
exports.seedDemoCampusSchema = zod_1.z.object({
    confirmExisting: zod_1.z.boolean().optional().default(false),
}).strict();
exports.getDemoSeedJobSchema = zod_1.z.object({
    jobId: zod_1.z.string().trim().min(1).max(128),
}).strict();
exports.resetDemoCampusSchema = zod_1.z.object({
    confirmPhrase: zod_1.z.string().trim(),
}).strict();
exports.sendAuthVerificationEmailSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email().max(200).optional(),
}).strict();
exports.sendAuthPasswordResetEmailSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email().max(200),
    tenantCode: zod_1.z.string().trim().max(100).optional(),
    tenantName: zod_1.z.string().trim().max(200).optional(),
}).strict();
function parseOrThrow(schema, input) {
    const result = schema.safeParse(input);
    if (!result.success) {
        const firstIssue = result.error.issues[0];
        const issueMsg = firstIssue ? `${firstIssue.path.join('.') || 'Payload'}: ${firstIssue.message}` : "Invalid request payload.";
        console.warn("[parseOrThrow Validation Error]:", issueMsg, result.error.format());
        throw new https_1.HttpsError("invalid-argument", issueMsg);
    }
    return result.data;
}
//# sourceMappingURL=validators.js.map