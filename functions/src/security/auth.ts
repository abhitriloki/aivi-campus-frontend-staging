import * as admin from "firebase-admin";
import { CallableRequest, HttpsError } from "firebase-functions/v2/https";

export interface TenantAuthContext {
    uid: string;
    tenantId: string | null;
    role: TenantRole;
    email: string;
    emailVerified: boolean;
    tokenClaims: Record<string, any>;
    branchScope?: string[];
}

export async function requireVerifiedAuth(request: CallableRequest): Promise<string> {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new HttpsError("unauthenticated", "Sign in required.");
    }

    try {
        const authUser = await admin.auth().getUser(uid);
        if (!authUser.emailVerified) {
            console.warn(`[requireVerifiedAuth] User ${uid} (${authUser.email}) emailVerified is false; proceeding.`);
        }
    } catch (e) {
        console.warn(`[requireVerifiedAuth] Unable to fetch user record for ${uid}:`, e);
    }

    return uid;
}

export async function isAdminUser(db: admin.firestore.Firestore, uid: string, tokenRole?: string): Promise<boolean> {
    if (tokenRole === "platform_admin" || tokenRole === "admin") return true;
    const roleSnap = await db.collection("user_roles").doc(uid).get();
    const role = roleSnap.data()?.role;
    return role === "admin" || role === "platform_admin";
}

export async function requireAdmin(db: admin.firestore.Firestore, uid: string): Promise<void> {
    if (!(await isAdminUser(db, uid))) {
        throw new HttpsError("permission-denied", "Admin only.");
    }
}

export type TenantRole = "platform_admin" | "group_admin" | "tenant_admin" | "coordinator" | "placement_director" | "tpo" | "student" | "b2c" | "recruiter" | "staff" | "placement_staff";

export async function requireTenantAuth(
    request: CallableRequest,
    allowedRoles?: Array<TenantRole>,
    checkDpdpConsent: boolean = false
): Promise<TenantAuthContext> {
    const uid = await requireVerifiedAuth(request);
    const authUser = await admin.auth().getUser(uid);
    const token = (request.auth?.token as any) || {};

    let tenantId: string | null = (token.tenantId as string) || null;
    let role: TenantRole = (token.role as any) || "b2c";
    let branchScope: string[] = Array.isArray(token.branchScope) ? token.branchScope : [];

    if (!tenantId) {
        const db = admin.firestore();
        const profileSnap = await db.collection("profiles").doc(uid).get();
        if (profileSnap.exists) {
            const pData = profileSnap.data();
            tenantId = pData?.tenantId || null;
            if ((!token.role || token.role === "b2c") && pData?.role) {
                role = pData.role;
            }
        }
    }

    // Backward compatibility for platform_admin:
    // Existing user_roles "admin" / "super_admin" / founder email => platform_admin
    if (token.role === "platform_admin" || token.role === "admin" || authUser.email === "abhi.triloki@gmail.com") {
        role = "platform_admin";
    } else {
        const db = admin.firestore();
        const roleSnap = await db.collection("user_roles").doc(uid).get();
        if (roleSnap.exists) {
            const r = roleSnap.data()?.role;
            if (r === "admin" || r === "platform_admin" || r === "super_admin") {
                role = "platform_admin";
            }
        }
    }

    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(role)) {
            throw new HttpsError("permission-denied", "Access denied for role.");
        }
    }

    if (checkDpdpConsent && role === "student" && tenantId) {
        const db = admin.firestore();
        const profileSnap = await db.collection("profiles").doc(uid).get();
        if (!profileSnap.exists || !profileSnap.data()?.dpdpConsent) {
            throw new HttpsError("failed-precondition", "DPDP consent required before running AI analysis.");
        }
    }

    return {
        uid,
        tenantId,
        role,
        email: authUser.email || "",
        emailVerified: authUser.emailVerified,
        tokenClaims: token,
        branchScope,
    };
}

