"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeError = safeError;
exports.logSafeError = logSafeError;
const https_1 = require("firebase-functions/v2/https");
function safeError(error, fallback = "Request failed. Please try again.") {
    if (error instanceof https_1.HttpsError)
        return error;
    return new https_1.HttpsError("internal", fallback);
}
function logSafeError(scope, error, extra = {}) {
    const err = error;
    console.error(scope, {
        code: err?.code,
        message: typeof err?.message === "string" ? err.message.substring(0, 200) : undefined,
        ...extra,
    });
}
//# sourceMappingURL=errors.js.map