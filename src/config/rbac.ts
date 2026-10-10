/**
 * Centralized Role-Based Access Control (RBAC) Permissions Matrix (Phase P05)
 * Defines allowed routes, navigation items, and server actions for all 6 system roles.
 */

export type AppRole =
  | "super_admin"
  | "platform_admin"
  | "tenant_admin"
  | "placement_director"
  | "tpo"
  | "student"
  | "recruiter";

export interface RolePermissions {
  displayName: string;
  allowedRoutes: string[];
  canManageStaff: boolean;
  canManageBilling: boolean;
  canManageTenantSettings: boolean;
  canViewAccreditation: boolean;
  canManageDrives: boolean;
  canViewAllStudents: boolean;
}

export class RBACMatrix {
  static PERMISSIONS: Record<AppRole, RolePermissions> = {
    super_admin: {
      displayName: "Super Admin (AIVI)",
      allowedRoutes: ["*"],
      canManageStaff: true,
      canManageBilling: true,
      canManageTenantSettings: true,
      canViewAccreditation: true,
      canManageDrives: true,
      canViewAllStudents: true,
    },
    platform_admin: {
      displayName: "Platform Admin (AIVI)",
      allowedRoutes: ["*"],
      canManageStaff: true,
      canManageBilling: true,
      canManageTenantSettings: true,
      canViewAccreditation: true,
      canManageDrives: true,
      canViewAllStudents: true,
    },
    tenant_admin: {
      displayName: "College Admin / Dean",
      allowedRoutes: [
        "/campus",
        "/tpo",
        "/campus/students",
        "/campus/drives",
        "/campus/sprints",
        "/campus/vault",
        "/campus/interviews",
        "/campus/accreditation",
        "/campus/billing",
        "/campus/staff",
        "/campus/settings",
      ],
      canManageStaff: true,
      canManageBilling: true,
      canManageTenantSettings: true,
      canViewAccreditation: true,
      canManageDrives: true,
      canViewAllStudents: true,
    },
    placement_director: {
      displayName: "Placement Director",
      allowedRoutes: [
        "/campus",
        "/tpo",
        "/campus/students",
        "/campus/drives",
        "/campus/sprints",
        "/campus/vault",
        "/campus/interviews",
        "/campus/accreditation",
      ],
      canManageStaff: false,
      canManageBilling: false,
      canManageTenantSettings: false,
      canViewAccreditation: true,
      canManageDrives: true,
      canViewAllStudents: true,
    },
    tpo: {
      displayName: "Training & Placement Officer (TPO)",
      allowedRoutes: [
        "/campus",
        "/tpo",
        "/campus/students",
        "/campus/drives",
        "/campus/sprints",
        "/campus/vault",
        "/campus/interviews",
      ],
      canManageStaff: false,
      canManageBilling: false,
      canManageTenantSettings: false,
      canViewAccreditation: false,
      canManageDrives: true,
      canViewAllStudents: true,
    },
    student: {
      displayName: "Student Candidate",
      allowedRoutes: [
        "/dashboard",
        "/campus/profile",
        "/campus/student-profile",
        "/campus/student-drives",
        "/campus/sprints",
        "/campus/student-vault",
        "/campus/resume-intelligence",
        "/campus/resume-studio",
        "/campus/job-fit",
        "/campus/interviews",
        "/campus/skill-roadmap",
        "/campus/linkedin-analyzer",
        "/ai-resume-builder",
        "/job-fit-analysis-tool",
        "/interview-prep",
        "/career-gap-analysis-ai",
        "/linkedin-optimization",
      ],
      canManageStaff: false,
      canManageBilling: false,
      canManageTenantSettings: false,
      canViewAccreditation: false,
      canManageDrives: false,
      canViewAllStudents: false,
    },
    recruiter: {
      displayName: "Corporate Recruiter",
      allowedRoutes: [
        "/recruiter",
        "/recruiter/candidates",
        "/recruiter/drives",
      ],
      canManageStaff: false,
      canManageBilling: false,
      canManageTenantSettings: false,
      canViewAccreditation: false,
      canManageDrives: false,
      canViewAllStudents: false,
    },
  };

  /**
   * Normalizes unknown roles to "student" default
   */
  static normalizeRole(rawRole?: string | null): AppRole {
    if (!rawRole) return "student";
    const clean = rawRole.toLowerCase().trim();
    if (clean === "admin") return "super_admin";
    if (clean === "coordinator") return "tpo";

    if (clean in RBACMatrix.PERMISSIONS) {
      return clean as AppRole;
    }
    return "student";
  }

  /**
   * Checks if role is allowed to access route
   */
  static isRouteAllowed(role: AppRole, path: string): boolean {
    const perm = RBACMatrix.PERMISSIONS[role] || RBACMatrix.PERMISSIONS.student;
    if (perm.allowedRoutes.includes("*")) return true;

    return perm.allowedRoutes.some((route) => {
      if (route === path) return true;
      if (route !== "/" && route !== "/campus" && path.startsWith(`${route}/`)) return true;
      return false;
    });
  }
}
