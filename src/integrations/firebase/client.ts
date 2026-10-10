import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";
import { validateEnvironmentContract } from "@/config/envContract";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _functions: Functions | null = null;
let _authPersistenceReady: Promise<void> | null = null;

export function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  functions: Functions;
} {
  if (_app && _auth && _db && _functions) {
    return { app: _app, auth: _auth, db: _db, functions: _functions };
  }

  // 1. Strict Contract Validation (Zero Defaults, Fail-Closed)
  const product = import.meta.env.VITE_APP_PRODUCT;
  const env = import.meta.env.VITE_APP_ENVIRONMENT;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const buildVersion = import.meta.env.VITE_BUILD_VERSION;
  const commitSha = import.meta.env.VITE_GIT_COMMIT_SHA;

  if (!product || !env || !projectId) {
    throw new Error(
      `[FAIL-CLOSED] Missing required environment variables: VITE_APP_PRODUCT=${product}, VITE_APP_ENVIRONMENT=${env}, VITE_FIREBASE_PROJECT_ID=${projectId}. Startup aborted.`
    );
  }

  // Enforce zero hardcoded fallback to aivi-career
  if (projectId === "aivi-career" || product !== "CAMPUS_OS") {
    throw new Error(
      `[FAIL-CLOSED] Invalid project/product combination for Campus OS: product=${product}, projectId=${projectId}. Startup aborted.`
    );
  }

  // Validate strict contract - pass raw values without "unknown" fallback
  validateEnvironmentContract({
    product,
    environment: env,
    projectId,
    buildVersion: buildVersion || "",
    commitSha: commitSha || "",
    isTest: import.meta.env.MODE === "test",
  });

  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (!apiKey || !authDomain || !storageBucket || !messagingSenderId || !appId) {
    throw new Error(
      `[FAIL-CLOSED] Incomplete Firebase client configuration for ${projectId}. All keys must be explicitly provided in environment.`
    );
  }

  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };

  // Harden app reuse: Never blindly reuse getApps()[0]
  const existingApps = getApps();
  if (existingApps.length > 0) {
    const defaultApp = existingApps.find((a) => a.name === "[DEFAULT]");
    if (defaultApp) {
      if (defaultApp.options.projectId === projectId) {
        _app = defaultApp;
      } else {
        throw new Error(
          `[CONTRACT_VIOLATION] Existing default Firebase app is bound to mismatched project '${defaultApp.options.projectId}'. Required: '${projectId}'. Startup aborted.`
        );
      }
    } else {
      const matchingApp = existingApps.find((a) => a.options.projectId === projectId);
      if (matchingApp) {
        _app = matchingApp;
      } else {
        throw new Error(
          `[CONTRACT_VIOLATION] Existing Firebase apps do not match required project '${projectId}'. Startup aborted.`
        );
      }
    }
  } else {
    _app = initializeApp(firebaseConfig);
  }
  _auth = getAuth(_app);
  _db = getFirestore(_app);
  // 100% Sovereign Domestic Data Residency in Mumbai (asia-south1) for DPDP Act 2023 compliance
  _functions = getFunctions(_app, "asia-south1");

  _authPersistenceReady = setPersistence(_auth, browserLocalPersistence).catch((error) => {
    console.error("Auth persistence error:", error);
  });

  if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true") {
    connectAuthEmulator(_auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(_db, "localhost", 8080);
    connectFunctionsEmulator(_functions, "localhost", 5001);
  }

  return { app: _app, auth: _auth, db: _db, functions: _functions };
}

/**
 * Returns the real (unwrapped) Firestore instance. Use this in dynamic imports
 * (`await import("@/integrations/firebase/client").then(m => m.getDb())`) so that
 * Firebase SDK instanceof checks pass without needing a Proxy getPrototypeOf trap
 * (which causes Firestore a540 internal assertion errors when concurrent queries fire).
 */
export function getDb(): Firestore {
  return _db || initializeFirebase().db;
}

export function getAuthInstance(): Auth {
  return _auth || initializeFirebase().auth;
}

export function getFunctionsInstance(): Functions {
  return _functions || initializeFirebase().functions;
}

// Proxies for legacy/static import compatibility — property access delegates to real instance.
// NOTE: Do NOT add getPrototypeOf traps here — they make instanceof checks succeed on the proxy,
// causing concurrent getDocs() calls that trigger Firestore a540 internal assertion errors.
export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const initialized = _auth || initializeFirebase().auth;
    const value = (initialized as any)[prop];
    return typeof value === "function" ? value.bind(initialized) : value;
  },
});

export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    const initialized = _db || initializeFirebase().db;
    const value = (initialized as any)[prop];
    return typeof value === "function" ? value.bind(initialized) : value;
  },
});

export const functions: Functions = new Proxy({} as Functions, {
  get(_target, prop) {
    const initialized = _functions || initializeFirebase().functions;
    const value = (initialized as any)[prop];
    return typeof value === "function" ? value.bind(initialized) : value;
  },
});

let _functionsMumbai: Functions | null = null;

export function getFunctionsMumbaiInstance(): Functions {
  if (!_functionsMumbai) {
    const { app } = initializeFirebase();
    _functionsMumbai = getFunctions(app, "asia-south1");
    if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true") {
      connectFunctionsEmulator(_functionsMumbai, "localhost", 5001);
    }
  }
  return _functionsMumbai;
}

export const functionsMumbai: Functions = new Proxy({} as Functions, {
  get(_target, prop) {
    const initialized = getFunctionsMumbaiInstance();
    const value = (initialized as any)[prop];
    return typeof value === "function" ? value.bind(initialized) : value;
  },
});

export const authPersistenceReady: Promise<void> = new Proxy(Promise.resolve(), {
  get(_target, prop) {
    if (!_authPersistenceReady) {
      initializeFirebase();
    }
    const value = (_authPersistenceReady as any)[prop];
    return typeof value === "function" ? value.bind(_authPersistenceReady) : value;
  },
});

