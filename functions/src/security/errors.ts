import { HttpsError } from "firebase-functions/v2/https";

export function safeError(error: unknown, fallback = "Request failed. Please try again."): HttpsError {
    if (error instanceof HttpsError) return error;
    return new HttpsError("internal", fallback);
}

export function logSafeError(scope: string, error: unknown, extra: Record<string, unknown> = {}): void {
    const err = error as { code?: unknown; message?: unknown; stack?: unknown };
    console.error(scope, {
        code: err?.code,
        message: typeof err?.message === "string" ? err.message.substring(0, 200) : undefined,
        ...extra,
    });
}
