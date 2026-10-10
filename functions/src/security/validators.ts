import { HttpsError } from "firebase-functions/v2/https";
import { z } from "zod";

export const analysisTypeSchema = z.enum([
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

const safeText = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const checkUsageSchema = z.object({
    analysisType: analysisTypeSchema,
}).strict();

export const exchangeLinkedInCodeSchema = z.object({
    code: z.string().trim().min(1).max(2000),
    redirectUri: z.string().trim().url(),
}).strict();

export const applyCouponSchema = z.object({
    code: z.string().trim().min(1).max(40).transform((value) => value.toUpperCase()),
}).strict();

export const careerAnalysisSchema = z.object({
    analysis_type: analysisTypeSchema,
    resume_text: optionalText(120_000),
    job_description: optionalText(80_000),
    projects: z.array(z.object({
        name: safeText(200),
        description: safeText(8_000),
    })).max(25).optional(),
    current_role: optionalText(200),
    target_role: optionalText(200),
    missing_skills: z.object({
        critical: z.array(z.string().trim().max(300)).max(50).default([]),
        moderate: z.array(z.string().trim().max(300)).max(50).default([]),
        minor: z.array(z.string().trim().max(300)).max(50).default([]),
    }).optional(),
});

export const saveAnalysisResultSchema = z.object({
    analysisType: analysisTypeSchema,
    result: z.unknown(),
    scores: z.unknown().optional(),
    contentHash: z.string().trim().max(128).nullable().optional(),
}).strict();

export const extractPdfSchema = z.object({
    pdf_base64: z.string().min(100).max(12_000_000),
}).strict();

export const adminUpdateUserSchema = z.object({
    targetUserId: z.string().trim().min(1).max(128),
    role: z.enum(["admin", "user"]).optional(),
    planType: z.enum(["free", "starter", "pro"]).optional(),
    resetQuota: z.boolean().optional(),
}).strict();

export const linkedinAnalyzeSchema = z.object({
    profileText: safeText(80_000),
}).strict();

export const linkedinOptimizeSchema = z.object({
    analysisId: z.string().trim().min(1).max(160),
    targetRole: optionalText(200),
    industry: optionalText(200),
}).strict();

export const contactFormSchema = z.object({
    name: safeText(100),
    email: z.string().trim().email().max(255),
    subject: safeText(200),
    message: safeText(2_000),
    type: z.enum(["general", "campus_demo"]).optional().default("general"),
    designation: optionalText(150),
    institution: optionalText(200),
    city: optionalText(100),
    phone: optionalText(30),
    studentStrength: optionalText(50),
    utm: z.object({
        source: optionalText(100),
        medium: optionalText(100),
        campaign: optionalText(100),
    }).optional(),
}).strict();

export const createPaymentOrderSchema = z.object({
    planType: z.enum(["starter", "pro"]),
}).strict();

export const RESERVED_SLUGS = [
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
] as const;

export const RESERVED_SLUGS_SET = new Set<string>(RESERVED_SLUGS);
export const TENANT_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
export function validatePreNormalizedDomain(rawDomain: string): { valid: boolean; reason?: string } {
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
export function normalizeDomain(rawDomain: string): string {
    if (!rawDomain) return "";
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
export function validateNormalizedDomain(domain: string): { valid: boolean; reason?: string } {
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

export const provisionTenantSchema = z.object({
    code: z.string().trim().min(3, "Slug must be at least 3 characters").max(63, "Slug must be at most 63 characters")
        .regex(TENANT_SLUG_REGEX, "Slug must contain only lowercase alphanumeric characters separated by single hyphens, with no leading or trailing hyphens")
        .refine((val) => !RESERVED_SLUGS_SET.has(val.toLowerCase()), {
            message: "This tenant slug is reserved and cannot be used",
        }).optional(),
    domain: z.string().trim().min(1).max(255).optional(),
    name: z.string().trim().min(2).max(200),
    type: z.enum(["college", "university", "group"]).optional().default("college"),
    plan: z.enum(["trial", "starter", "growth", "pro", "university"]).optional().default("starter"),
    seats: z.number().int().positive().max(500000).optional(),
    maxSeats: z.number().int().positive().max(500000).optional(),
    state: z.string().trim().max(100).optional(),
    city: z.string().trim().max(100).optional(),
    address: z.string().trim().max(300).optional(),
    gstin: z.string().trim().max(30).optional(),
    pinCode: z.string().trim().max(10).optional(),
    adminName: z.string().trim().min(2).max(200).optional(),
    adminEmail: z.string().trim().email().max(255),
    adminPassword: z.string().min(6).max(128).optional(),
    idempotencyKey: z.string().trim().min(16).max(128).optional(),
    modules: z.array(z.string().trim().max(50)).optional(),
    branding: z.object({
        logoUrl: z.string().trim().max(1000).optional(),
        primaryColor: z.string().trim().max(30).optional(),
        loginHeadline: z.string().trim().max(200).optional(),
    }).optional(),
    academicYear: z.string().trim().max(50).optional(),
}).refine((raw) => {
    if (!raw.domain) return true;
    // Step 1: Pre-normalization check. Reject URLs, schemes, paths, queries, ports, wildcards, userinfo
    const preCheck = validatePreNormalizedDomain(raw.domain);
    if (!preCheck.valid) return false;
    // Step 2: Canonical normalization (trim, lowercase, trailing root dot, leading www.)
    const normalized = normalizeDomain(raw.domain);
    // Step 3: Strict RFC 1035/1123 hostname validation
    const result = validateNormalizedDomain(normalized);
    return result.valid;
}, {
    message: "Invalid tenant domain: must be a bare hostname (e.g. college.edu or campus.univ.ac.in), not a URL, path, email, or port",
    path: ["domain"],
}).transform((raw) => {
    let resolvedSlug: string;
    if (raw.code) {
        resolvedSlug = raw.code.toLowerCase();
    } else {
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

export const setTenantRoleSchema = z.object({
    targetUid: z.string().trim().min(1).max(128),
    role: z.enum(["tenant_admin", "coordinator"]),
    branchScope: z.array(z.string().trim().max(100)).optional(),
    tenantId: z.string().trim().min(1).optional(),
}).strict();

export const setTenantClaimsSchema = z.object({
    targetUid: z.string().trim().min(1).max(128),
    tenant_id: z.string().trim().min(1).max(128),
    role: z.enum(["student", "tenant_admin", "coordinator", "platform_admin"]).default("student"),
}).strict();

export const getMyTenantContextSchema = z.object({}).optional();

export const importStudentsCsvSchema = z.object({
    csvBase64: z.string().min(10).max(15_000_000),
    columnMap: z.record(z.string(), z.string().trim().max(100)),
    dryRun: z.boolean().default(true),
    jobId: z.string().trim().max(128).optional(),
}).strict();

export const getImportJobSchema = z.object({
    jobId: z.string().trim().min(1).max(128),
}).strict();

export const getCampusStudentsSchema = z.object({
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(20),
    branch: z.string().trim().max(100).optional(),
    batch: z.number().int().min(1990).max(2100).optional(),
    status: z.enum(["unplaced", "placed", "higher_studies", "entrepreneur", "not_seeking", "all"]).optional(),
    search: z.string().trim().max(200).optional(),
    tenantId: z.string().trim().min(1).optional(),
}).strict();

export const addCampusStudentSchema = z.object({
    name: z.string().trim().min(1, "Student name is required").max(120),
    email: z.string().trim().email("Valid institutional email is required"),
    enrollmentNo: z.string().trim().min(1, "Enrollment number is required").max(60),
    branch: z.string().trim().min(1, "Branch is required").max(60),
    batch: z.preprocess((val) => typeof val === "string" ? parseInt(val, 10) : val, z.number().int().min(1990).max(2100)),
    section: z.string().trim().max(30).nullable().optional().or(z.literal("")),
    phone: z.string().trim().regex(/^(\+?[0-9\s-]{10,15})?$/, "Phone must be a valid 10-15 digit phone number").nullable().optional().or(z.literal("")),
    cgpa: z.preprocess((val) => (val === "" || val === null || val === undefined) ? undefined : typeof val === "string" ? parseFloat(val) : val, z.number().min(0).max(10).optional()),
    tenantId: z.string().trim().min(1).optional().or(z.literal("")),
}).passthrough();

export const deleteCampusStudentSchema = z.object({
    studentId: z.string().trim().min(1, "Student ID is required"),
    tenantId: z.string().trim().min(1).optional(),
}).strict();

export const rollbackImportJobSchema = z.object({
    jobId: z.string().trim().min(1, "Job ID is required"),
    tenantId: z.string().trim().min(1).optional(),
}).strict();

export const getTenantBrandingSchema = z.object({
    code: z.string().trim().min(1).max(50),
}).strict();

export const acceptDpdpConsentSchema = z.object({
    locale: z.enum(["en", "hi"]).default("en"),
    version: z.string().trim().default("v1.0"),
}).strict();

export const inviteCoordinatorSchema = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email(),
    branchScope: z.array(z.string().trim().max(100)).optional().default([]),
}).strict();

export const deactivateStaffSchema = z.object({
    targetUid: z.string().trim().min(1).max(128),
}).strict();

export const getTenantStaffSchema = z.object({
    tenantId: z.string().trim().min(1).optional(),
}).optional();
export const listTenantsPublicSchema = z.object({}).optional();

export const reassignTenantAdminSchema = z.object({
    tenantId: z.string().trim().min(1),
    adminEmail: z.string().trim().email(),
    adminName: z.string().trim().min(1),
    temporaryPassword: z.string().trim().min(6).optional(),
}).strict();

export const backfillAesSchema = z.preprocess((val) => {
    if (typeof val === "number") return { batchSize: val };
    if (!val || typeof val !== "object") return {};
    return val;
}, z.object({
    batchSize: z.number().int().min(1).max(500).default(200),
    tenantId: z.string().optional(),
}).passthrough());

export const aggregateTenantStatsSchema = z.object({
    tenantId: z.string().trim().min(1).max(128).optional(),
}).strict();

export const nudgeStudentSchema = z.object({
    studentId: z.string().trim().min(1).max(128),
}).strict();

export const parseDriveJdSchema = z.object({
    jdText: z.string().trim().min(10, "JD text must be at least 10 characters"),
}).strict();

export const createDriveSchema = z.object({
    company: z.string().trim().min(1),
    roleTitle: z.string().trim().min(1),
    ctcText: z.string().trim().min(1),
    jdText: z.string().trim().min(10),
    jdParsed: z.object({
        requiredSkills: z.array(z.string()).default([]),
        niceSkills: z.array(z.string()).default([]),
        minCgpa: z.number().optional(),
        branchesHint: z.array(z.string()).default([]),
        responsibilities: z.array(z.string()).default([]),
    }).optional(),
    eligibility: z.object({
        minCgpa: z.number().optional(),
        maxBacklogs: z.number().optional(),
        batches: z.array(z.string()).default([]),
        branches: z.array(z.string()).default([]),
    }).default({ batches: [], branches: [] }),
    stages: z.array(z.object({
        name: z.string(),
        date: z.string(),
        mode: z.string().default("online"),
    })).default([]),
}).strict();

export const updateDriveSchema = z.object({
    driveId: z.string().trim().min(1),
    updates: z.record(z.string(), z.any()),
}).strict();

export const publishDriveSchema = z.object({
    driveId: z.string().trim().min(1),
}).strict();

export const computeDriveShortlistSchema = z.object({
    driveId: z.string().trim().min(1),
}).strict();

export const generateDriveSprintSchema = z.object({
    driveId: z.string().trim().min(1),
    durationDays: z.number().int().min(1).max(30).default(7),
}).strict();

export const enrollInSprintSchema = z.object({
    sprintId: z.string().trim().min(1),
    onlyEligible: z.boolean().optional(),
}).strict();

export const markSprintTaskDoneSchema = z.object({
    sprintId: z.string().trim().min(1),
    taskId: z.string().trim().min(1),
}).strict();

export const createSprintTrackSchema = z.object({
    title: z.string().trim().min(1),
    planTemplateId: z.string().trim().min(1),
    target: z.object({
        branch: z.string().optional(),
        batch: z.string().optional(),
        studentUids: z.array(z.string()).default([]),
    }).default({ studentUids: [] }),
    driveId: z.string().optional(),
}).strict();

export const getTrackAnalyticsSchema = z.object({
    trackId: z.string().trim().min(1),
}).strict();

export const recordDriveOutcomeSchema = z.object({
    driveId: z.string().trim().min(1),
    userId: z.string().trim().min(1),
    stageIndex: z.number().int().min(0),
    outcome: z.enum(["pending", "selected", "rejected", "offer"]),
    offerCtc: z.number().nullable().optional(),
    packageLpa: z.number().nullable().optional(),
    offerLetterUrl: z.string().nullable().optional(),
    joiningDate: z.string().nullable().optional(),
    rejectionReason: z.enum(["technical_round", "hr_round", "aptitude", "declined_by_candidate", "other"]).nullable().optional(),
    rejectionNotes: z.string().nullable().optional(),
}).strict();

export const updateStudentPlacementStatusSchema = z.object({
    studentUid: z.string().trim().min(1),
    placementStatus: z.enum(["placed", "unplaced", "higher_studies", "opted_out"]),
    placedCompany: z.string().optional(),
    placedPackageLpa: z.number().optional(),
}).strict();

export const submitVaultResumeSchema = z.object({
    resumeData: z.record(z.string(), z.any()),
    analysisId: z.string().optional(),
}).strict();

export const verifyResumeSchema = z.object({
    versionId: z.string().trim().min(1),
}).strict();

export const requestResumeChangesSchema = z.object({
    versionId: z.string().trim().min(1),
    reviewerNote: z.string().trim().min(1, "Reviewer note required when requesting changes"),
}).strict();

export const getResumeSignedUrlSchema = z.object({
    versionId: z.string().trim().min(1),
}).strict();

export const exportResumePackageSchema = z.object({
    filters: z.object({
        batch: z.string().optional(),
        branches: z.array(z.string()).optional(),
        driveId: z.string().optional(),
        minAes: z.number().optional(),
        onlyVerified: z.boolean().optional(),
    }).optional(),
}).strict();

// P12: Drive-specific resume ZIP exporter (consent-filtered, cover sheet, 7-day URL, email)
export const generateDriveResumePackSchema = z.object({
    driveId: z.string().trim().min(1, "Drive ID required"),
    // Explicit candidate selection — UIDs of students the TPO ticked
    selectedUserIds: z.array(z.string().min(1)).min(1, "Select at least one candidate").max(500, "Maximum 500 per pack"),
    // Optional recruiter email to CC the download link
    recruiterEmail: z.string().email().nullable().optional().or(z.literal("")),
    // Optional custom note for the cover sheet
    packNote: z.string().max(300).nullable().optional(),
}).strict();

export const getExportJobSchema = z.object({
    exportId: z.string().trim().min(1),
}).strict();


export const startMockInterviewSchema = z.object({
    mode: z.enum(["hr", "technical", "mixed"]).optional().default("mixed"),
    language: z.enum(["hi", "hinglish", "en"]).optional().default("hinglish"),
    roleContext: z.string().nullable().optional(),
    driveId: z.string().nullable().optional(),
    questionCount: z.number().int().min(3).max(15).optional().default(6),
});

export const answerMockInterviewTurnSchema = z.object({
    sessionId: z.string().trim().min(1),
    turnIndex: z.number().int().min(0),
    audioBase64: z.string().nullable().optional(),
    transcriptOverride: z.string().nullable().optional(),
});

export const finishMockInterviewSchema = z.object({
    sessionId: z.string().trim().min(1),
});

export const voiceInterviewTurnSchema = z.object({
    sessionId: z.string().trim().min(1),
    turnIndex: z.number().int().min(0),
    audioBase64: z.string().min(1, "Audio data required"),
}).strict();

// ── P15: Real-Time Gemini Live Voice Session Schemas ─────────────────────────
export const startRealtimeVoiceSessionSchema = z.object({
    driveId: z.string().nullable().optional(),
    personaId: z.enum(["ananya", "vikram", "priya", "kabir", "custom"]).optional().default("vikram"),
    voiceId: z.enum(["Aoede", "Fenrir", "Kore", "Puck"]).optional().default("Fenrir"),
    targetRole: z.string().optional().default("Software Development Engineer"),
    company: z.string().optional().default("Accenture"),
    jdText: z.string().nullable().optional(),
    language: z.enum(["en", "hi", "hinglish"]).optional().default("en"),
    strictness: z.enum(["gentle", "realistic", "bar_raiser"]).optional().default("realistic"),
    customInstructions: z.string().max(1000).optional(),
});

export const evaluateRealtimeVoiceSessionSchema = z.object({
    sessionId: z.string().trim().min(1),
    transcript: z.array(z.object({
        role: z.string(),
        text: z.string(),
        timestamp: z.number().optional(),
    })).min(1, "Transcript must have at least one turn"),
    targetRole: z.string().optional(),
    company: z.string().optional(),
    durationSeconds: z.number().optional(),
});

export const realtimeVoiceNextTurnSchema = z.object({
    sessionId: z.string().trim().min(1),
    transcript: z.array(z.object({
        role: z.string(),
        text: z.string(),
        timestamp: z.number().optional(),
    })).min(1),
    company: z.string().optional().default("Accenture"),
    targetRole: z.string().optional().default("Software Engineer"),
    personaId: z.enum(["ananya", "vikram", "priya", "kabir", "custom"]).optional().default("vikram"),
    language: z.enum(["en", "hi", "hinglish"]).optional().default("en"),
    strictness: z.enum(["gentle", "realistic", "bar_raiser"]).optional().default("realistic"),
    turnIndex: z.number().int().min(1).default(1),
    currentPillar: z.number().int().min(1).max(4).optional().default(1),
    pillarTurnsCount: z.number().int().min(0).max(10).optional().default(0),
});

export const provisionSsoUserSchema = z.object({
    tenantId: z.string().trim().min(1, "Tenant ID required"),
}).strict();

export const generateQuestionBankSchema = z.object({
    jdText: z.string().trim().min(10, "Job description must be at least 10 characters long."),
    resumeText: z.string().nullable().optional(),
    rounds: z.array(z.enum(["Behavioral", "Technical", "HR", "Aptitude Basics"])).min(1, "Select at least one round."),
    language: z.enum(["en", "hi"]).optional().default("en"),
});

export const generateCustomQuestionPackSchema = z.object({
    companyName: z.string().trim().min(2, "Company name is required."),
    roleTrack: z.string().nullable().optional(),
});

export const requestCompanyPackSchema = z.object({
    companyName: z.string().trim().min(2, "Company name is required."),
});

export const seedCompanyQuestionPacksSchema = z.object({
    forceReSeed: z.boolean().optional().default(false),
});

export const adjustFacultyInterviewScoreSchema = z.object({
    sessionId: z.string().trim().min(1),
    adjustedScore: z.number().min(0).max(10),
    note: z.string().trim().min(1, "Faculty review note is required"),
}).strict();

export const generateAccreditationReportSchema = z.object({
    academicYear: z.string().trim().min(4),
    type: z.enum(["naac_c5", "nirf", "bundle"]),
}).strict();

export const nudgeIncompleteProfileStudentsSchema = z.object({
    academicYear: z.string().trim().min(4),
}).strict();

export const generateTenantInvoiceSchema = z.object({
    tenantId: z.string().trim().min(1),
    mode: z.enum(["online", "offline_po"]).default("offline_po"),
    poNumber: z.string().optional(),
    poDate: z.string().optional(),
    customerLegalName: z.string().optional(),
    billingAddress: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    stateCode: z.string().optional(),
    pinCode: z.string().optional(),
    gstin: z.string().optional(),
    isGstExempt: z.boolean().optional(),
    attentionName: z.string().optional(),
    planId: z.string().optional(),
    seats: z.number().optional(),
    externalPdfUrl: z.string().optional(),
    notes: z.string().optional(),
}).passthrough();

export const markInvoicePaidSchema = z.object({
    invoiceId: z.string().trim().min(1),
}).strict();

export const updateTenantPlanSchema = z.object({
    tenantId: z.string().trim().min(1),
    plan: z.enum(["trial", "starter", "growth", "pro", "university"]),
    maxSeats: z.number().int().min(10),
}).strict();

export const toggleTenantStatusSchema = z.object({
    tenantId: z.string().trim().min(1),
    status: z.enum(["active", "suspended", "trial_expired"]),
}).strict();

export const updateTenantBrandingSchema = z.object({
    tenantId: z.string().trim().min(1),
    branding: z.object({
        logoUrl: z.string().trim().optional(),
        primaryColor: z.string().trim().optional(),
        accentColor: z.string().trim().optional(),
        loginHeadline: z.string().trim().optional(),
    }),
}).strict();

export const createAnnouncementSchema = z.object({
    title: z.string().trim().min(2),
    body: z.string().trim().min(5),
    targetBatch: z.string().default("ALL"),
    targetBranch: z.string().default("ALL"),
    targetDriveId: z.string().optional(),
}).strict();

export const markAnnouncementReadSchema = z.object({
    announcementId: z.string().trim().min(1),
}).strict();

export const createCampusEventSchema = z.object({
    title: z.string().trim().min(2),
    description: z.string().trim(),
    eventType: z.enum(["drive", "sprint_deadline", "workshop", "custom"]),
    startDate: z.string(),
    endDate: z.string(),
    location: z.string().default("Campus TPO Cell"),
}).strict();

export const getEventIcsFileSchema = z.object({
    eventId: z.string().trim().min(1),
}).strict();

export const generateParentProgressReportSchema = z.object({
    userId: z.string().trim().min(1),
    locale: z.enum(["hi", "en"]).default("en"),
}).strict();

export const exportAuditLogsSchema = z.object({
    tenantId: z.string().trim().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
}).strict();

export const generateTenantApiKeySchema = z.object({
    tenantId: z.string().trim().min(1),
    name: z.string().trim().min(2),
}).strict();

export const exportStateGovReadinessSchema = z.object({
    tenantId: z.string().trim().min(1),
    academicYear: z.string().trim().min(4),
}).strict();

export const purgeTenantDataSchema = z.object({
    tenantId: z.string().trim().min(1),
    confirmKey: z.string().trim().min(6),
}).strict();

export const archiveGraduatedBatchSchema = z.object({
    tenantId: z.string().trim().min(1),
    batch: z.string().trim().min(4),
}).strict();

export const seedDemoCampusSchema = z.object({
    confirmExisting: z.boolean().optional().default(false),
}).strict();

export const getDemoSeedJobSchema = z.object({
    jobId: z.string().trim().min(1).max(128),
}).strict();

export const resetDemoCampusSchema = z.object({
    confirmPhrase: z.string().trim(),
}).strict();

export const sendAuthVerificationEmailSchema = z.object({
    email: z.string().trim().email().max(200).optional(),
}).strict();

export const sendAuthPasswordResetEmailSchema = z.object({
    email: z.string().trim().email().max(200),
    tenantCode: z.string().trim().max(100).optional(),
    tenantName: z.string().trim().max(200).optional(),
}).strict();

export function parseOrThrow<T>(schema: z.ZodType<T>, input: unknown): T {
    const result = schema.safeParse(input);
    if (!result.success) {
        const firstIssue = result.error.issues[0];
        const issueMsg = firstIssue ? `${firstIssue.path.join('.') || 'Payload'}: ${firstIssue.message}` : "Invalid request payload.";
        console.warn("[parseOrThrow Validation Error]:", issueMsg, result.error.format());
        throw new HttpsError("invalid-argument", issueMsg);
    }
    return result.data;
}


