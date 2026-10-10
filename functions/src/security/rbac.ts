import { HttpsError } from "firebase-functions/v2/https";

export type AppRole =
  | "super_admin"
  | "platform_admin"
  | "tenant_admin"
  | "placement_director"
  | "tpo"
  | "student"
  | "recruiter";

export interface ServerAuthContext {
  uid: string;
  tenant_id: string | null;
  role: AppRole;
  isSuperAdmin: boolean;
}

export class ServerRBAC {
  /**
   * Normalizes incoming claim role to standard AppRole
   */
  static normalizeRole(rawRole?: string | null): AppRole {
    if (!rawRole) return "student";
    const clean = rawRole.toLowerCase().trim();
    if (clean === "admin") return "super_admin";
    if (clean === "coordinator") return "tpo";
    if (
      clean === "super_admin" ||
      clean === "platform_admin" ||
      clean === "tenant_admin" ||
      clean === "placement_director" ||
      clean === "tpo" ||
      clean === "student" ||
      clean === "recruiter"
    ) {
      return clean as AppRole;
    }
    return "student";
  }

  /**
   * Enforces role requirements on Cloud Functions
   */
  static enforceFunctionAccess(
    callerRole: string | undefined,
    allowedRoles: AppRole[]
  ): AppRole {
    const role = ServerRBAC.normalizeRole(callerRole);

    if (role === "super_admin" || role === "platform_admin") {
      return role; // Super admin bypass
    }

    if (!allowedRoles.includes(role)) {
      throw new HttpsError(
        "permission-denied",
        `Access Denied: Role '${role}' is not authorized to execute this action. Required roles: ${allowedRoles.join(", ")}.`
      );
    }

    return role;
  }
}
