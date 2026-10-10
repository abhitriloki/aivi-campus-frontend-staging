"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerRBAC = void 0;
const https_1 = require("firebase-functions/v2/https");
class ServerRBAC {
    /**
     * Normalizes incoming claim role to standard AppRole
     */
    static normalizeRole(rawRole) {
        if (!rawRole)
            return "student";
        const clean = rawRole.toLowerCase().trim();
        if (clean === "admin")
            return "super_admin";
        if (clean === "coordinator")
            return "tpo";
        if (clean === "super_admin" ||
            clean === "platform_admin" ||
            clean === "tenant_admin" ||
            clean === "placement_director" ||
            clean === "tpo" ||
            clean === "student" ||
            clean === "recruiter") {
            return clean;
        }
        return "student";
    }
    /**
     * Enforces role requirements on Cloud Functions
     */
    static enforceFunctionAccess(callerRole, allowedRoles) {
        const role = ServerRBAC.normalizeRole(callerRole);
        if (role === "super_admin" || role === "platform_admin") {
            return role; // Super admin bypass
        }
        if (!allowedRoles.includes(role)) {
            throw new https_1.HttpsError("permission-denied", `Access Denied: Role '${role}' is not authorized to execute this action. Required roles: ${allowedRoles.join(", ")}.`);
        }
        return role;
    }
}
exports.ServerRBAC = ServerRBAC;
//# sourceMappingURL=rbac.js.map