/**
 * AIVI Application & Environment Contracts (Strict Fail-Closed)
 * Product + Environment Matrix Validation with Zero Defaults.
 */

export type ProductType = "CAREER_OS" | "CAMPUS_OS" | "CAMPUS_DEMO";
export type EnvironmentType = "development" | "staging" | "production" | "test";

export interface StrictEnvironmentConfig {
  APP_PRODUCT: ProductType;
  APP_ENVIRONMENT: EnvironmentType;
  EXPECTED_FIREBASE_PROJECT_ID: string;
  ALLOWED_HOSTNAMES: string[];
  BUILD_VERSION: string;
  GIT_COMMIT_SHA: string;
}

// Product + Environment Matrix Definition
export interface MatrixPolicy {
  allowedProjects: string[];
  allowedHostnames: string[];
  isBlocked?: boolean;
  blockedReason?: string;
}

export const MATRIX_POLICIES: Record<ProductType, Partial<Record<EnvironmentType, MatrixPolicy>>> = {
  CAMPUS_OS: {
    development: {
      allowedProjects: ["aivi-campus-stg"],
      allowedHostnames: ["localhost", "127.0.0.1"],
    },
    staging: {
      allowedProjects: ["aivi-campus-stg"],
      allowedHostnames: [
        "isolation-staging.aivicampus.com",
        "staging.aivicampus.com",
        "aivi-campus-stg.web.app",
        "aivi-campus-stg.firebaseapp.com",
      ],
    },
    production: {
      allowedProjects: ["aivi-campus-prod"],
      allowedHostnames: ["aivicampus.com", "www.aivicampus.com"],
    },
    test: {
      allowedProjects: ["aivi-campus-stg"],
      allowedHostnames: ["localhost", "127.0.0.1"],
    },
  },
  CAMPUS_DEMO: {
    development: {
      allowedProjects: [],
      allowedHostnames: ["localhost", "127.0.0.1"],
    },
    staging: {
      allowedProjects: [],
      allowedHostnames: ["demo-next.aivilabs.com", "campus.aivilabs.com"],
    },
    production: {
      allowedProjects: [],
      allowedHostnames: ["campus.aivilabs.com"],
    },
    test: {
      allowedProjects: [],
      allowedHostnames: ["localhost", "127.0.0.1"],
    },
  },
  CAREER_OS: {
    development: {
      allowedProjects: ["aivi-career"],
      allowedHostnames: ["localhost", "127.0.0.1"],
    },
    staging: {
      allowedProjects: ["aivi-career"],
      allowedHostnames: ["staging.aivilabs.com"],
    },
    production: {
      allowedProjects: ["aivi-career"],
      allowedHostnames: ["aivilabs.com", "www.aivilabs.com"],
    },
    test: {
      allowedProjects: ["aivi-career"],
      allowedHostnames: ["localhost", "127.0.0.1"],
    },
  },
};

/**
 * Validates environment contract strictly fail-closed with ZERO defaults.
 * Uses exact hostname matching (no suffix wildcards).
 */
export function validateEnvironmentContract(params: {
  product: string;
  environment: string;
  projectId: string;
  buildVersion: string;
  commitSha: string;
  runtimeHostname?: string;
  isTest?: boolean;
}): StrictEnvironmentConfig {
  // 1. Validate Product
  if (!params.product || !params.product.trim()) {
    throw new Error("[CONTRACT_VIOLATION] Missing required APP_PRODUCT. Zero defaults allowed.");
  }
  const product = params.product.trim() as ProductType;
  if (!MATRIX_POLICIES[product]) {
    throw new Error(`[CONTRACT_VIOLATION] Invalid APP_PRODUCT: '${params.product}'. Must be CAREER_OS, CAMPUS_OS, or CAMPUS_DEMO.`);
  }

  // 2. Validate Environment
  if (!params.environment || !params.environment.trim()) {
    throw new Error("[CONTRACT_VIOLATION] Missing required APP_ENVIRONMENT. Zero defaults allowed.");
  }
  const env = params.environment.trim().toLowerCase() as EnvironmentType;
  if (!["development", "staging", "production", "test"].includes(env)) {
    throw new Error(`[CONTRACT_VIOLATION] Invalid APP_ENVIRONMENT: '${params.environment}'.`);
  }

  // 3. Absolute Invariant: Campus products must never connect to aivi-career in ANY environment
  const projectId = (params.projectId || "").trim();
  if ((product === "CAMPUS_OS" || product === "CAMPUS_DEMO") && projectId === "aivi-career") {
    throw new Error("[CONTRACT_VIOLATION] CRITICAL: Campus products are strictly forbidden from deploying or connecting to 'aivi-career'.");
  }

  // 4. Matrix Policy Evaluation
  const policy = MATRIX_POLICIES[product]?.[env];
  if (!policy) {
    throw new Error(`[CONTRACT_VIOLATION] No policy defined for ${product} in ${env} environment.`);
  }

  if (policy.isBlocked) {
    throw new Error(`[CONTRACT_VIOLATION] ${policy.blockedReason || "Environment blocked."}`);
  }

  // Enforce project binding from matrix
  if (projectId === "aivi-campus-staging") {
    throw new Error("[CONTRACT_VIOLATION] Project identifier 'aivi-campus-staging' is prohibited. Must be standardized as 'aivi-campus-stg'.");
  }
  if (!projectId) {
    throw new Error("[CONTRACT_VIOLATION] Missing required EXPECTED_FIREBASE_PROJECT_ID. Zero defaults allowed.");
  }
  if (policy.allowedProjects.length > 0 && !policy.allowedProjects.includes(projectId)) {
    throw new Error(`[CONTRACT_VIOLATION] Project '${projectId}' is not permitted for '${product}' in '${env}'. Permitted: ${policy.allowedProjects.join(", ")}`);
  }
  if (policy.allowedProjects.length === 0 && projectId) {
    throw new Error(`[CONTRACT_VIOLATION] Project '${projectId}' is not permitted for '${product}' in '${env}'. Permitted: none`);
  }

  // 5. Strict Build Version & Commit SHA (Fail Closed on missing/empty)
  if (!params.buildVersion || !params.buildVersion.trim()) {
    throw new Error("[CONTRACT_VIOLATION] Missing required BUILD_VERSION. Zero defaults allowed.");
  }
  if (!params.commitSha || !params.commitSha.trim()) {
    throw new Error("[CONTRACT_VIOLATION] Missing required GIT_COMMIT_SHA. Zero defaults allowed.");
  }

  // 6. Strict Exact Hostname Matching (NO suffix matching, NO arbitrary subdomains)
  const currentHost = params.runtimeHostname || (typeof window !== "undefined" ? window.location.hostname : "");
  if (currentHost && !params.isTest) {
    const isExactMatch = policy.allowedHostnames.includes(currentHost);
    if (!isExactMatch) {
      throw new Error(
        `[CONTRACT_VIOLATION] Runtime hostname '${currentHost}' is not authorized for ${product} in ${env}. Permitted exact hostnames: ${policy.allowedHostnames.join(", ")}`
      );
    }
  }

  return {
    APP_PRODUCT: product,
    APP_ENVIRONMENT: env,
    EXPECTED_FIREBASE_PROJECT_ID: projectId,
    ALLOWED_HOSTNAMES: policy.allowedHostnames,
    BUILD_VERSION: params.buildVersion.trim(),
    GIT_COMMIT_SHA: params.commitSha.trim(),
  };
}

