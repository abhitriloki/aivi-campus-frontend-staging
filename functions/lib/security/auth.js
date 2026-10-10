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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireVerifiedAuth = requireVerifiedAuth;
exports.isAdminUser = isAdminUser;
exports.requireAdmin = requireAdmin;
exports.requireTenantAuth = requireTenantAuth;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
async function requireVerifiedAuth(request) {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new https_1.HttpsError("unauthenticated", "Sign in required.");
    }
    try {
        const authUser = await admin.auth().getUser(uid);
        if (!authUser.emailVerified) {
            console.warn(`[requireVerifiedAuth] User ${uid} (${authUser.email}) emailVerified is false; proceeding.`);
        }
    }
    catch (e) {
        console.warn(`[requireVerifiedAuth] Unable to fetch user record for ${uid}:`, e);
    }
    return uid;
}
async function isAdminUser(db, uid, tokenRole) {
    if (tokenRole === "platform_admin" || tokenRole === "admin")
        return true;
    const roleSnap = await db.collection("user_roles").doc(uid).get();
    const role = roleSnap.data()?.role;
    return role === "admin" || role === "platform_admin";
}
async function requireAdmin(db, uid) {
    if (!(await isAdminUser(db, uid))) {
        throw new https_1.HttpsError("permission-denied", "Admin only.");
    }
}
async function requireTenantAuth(request, allowedRoles, checkDpdpConsent = false) {
    const uid = await requireVerifiedAuth(request);
    const authUser = await admin.auth().getUser(uid);
    const token = request.auth?.token || {};
    let tenantId = token.tenantId || null;
    let role = token.role || "b2c";
    let branchScope = Array.isArray(token.branchScope) ? token.branchScope : [];
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
    }
    else {
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
            throw new https_1.HttpsError("permission-denied", "Access denied for role.");
        }
    }
    if (checkDpdpConsent && role === "student" && tenantId) {
        const db = admin.firestore();
        const profileSnap = await db.collection("profiles").doc(uid).get();
        if (!profileSnap.exists || !profileSnap.data()?.dpdpConsent) {
            throw new https_1.HttpsError("failed-precondition", "DPDP consent required before running AI analysis.");
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
//# sourceMappingURL=auth.js.map