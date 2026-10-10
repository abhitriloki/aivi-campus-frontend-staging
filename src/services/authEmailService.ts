import { httpsCallable } from "firebase/functions";
import { functions, auth } from "@/integrations/firebase/client";
import { sendEmailVerification as clientSendEmailVerification, sendPasswordResetEmail as clientSendPasswordResetEmail, User } from "firebase/auth";

/**
 * Sends branded email verification link via Zoho Mail SMTP Cloud Function,
 * with fallback to Firebase Client SDK if offline.
 */
export async function requestVerificationEmail(user?: User | null, emailAddress?: string): Promise<{ success: boolean; message: string }> {
    const targetEmail = emailAddress || user?.email || auth.currentUser?.email || "";
    try {
        const sendAuthVerificationEmailFn = httpsCallable<{ email?: string }, { success: boolean; message: string }>(
            functions,
            "sendAuthVerificationEmail"
        );
        const res = await sendAuthVerificationEmailFn({ email: targetEmail });
        return res.data;
    } catch (fnErr: any) {
        console.warn("Zoho Cloud Function verification email failed, trying client SDK fallback:", fnErr);
        if (user || auth.currentUser) {
            await clientSendEmailVerification(user || auth.currentUser!);
            return { success: true, message: "Verification link sent via default provider." };
        }
        throw fnErr;
    }
}

/**
 * Sends branded password reset link via Zoho Mail SMTP Cloud Function,
 * with fallback to Firebase Client SDK if offline.
 */
export async function requestPasswordResetEmail(
    email: string,
    tenantCode?: string,
    tenantName?: string
): Promise<{ success: boolean; message: string }> {
    try {
        const sendAuthPasswordResetEmailFn = httpsCallable<
            { email: string; tenantCode?: string; tenantName?: string },
            { success: boolean; message: string }
        >(functions, "sendAuthPasswordResetEmail");
        const res = await sendAuthPasswordResetEmailFn({
            email,
            tenantCode: tenantCode || undefined,
            tenantName: tenantName || undefined,
        });
        return res.data;
    } catch (fnErr: any) {
        console.warn("Zoho Cloud Function password reset failed, trying client SDK fallback:", fnErr);
        await clientSendPasswordResetEmail(auth, email);
        return { success: true, message: "Password reset link sent via default provider." };
    }
}
