import { httpsCallable } from "firebase/functions";
import { functions } from "@/integrations/firebase/client";

type PaidPlanType = "starter" | "pro";

interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

/**
 * Robust Razorpay Checkout JS Loader with 10-second timeout & CSP error handling
 */
const loadRazorpay = async (): Promise<void> => {
  if (window.Razorpay) return;

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[src='https://checkout.razorpay.com/v1/checkout.js']");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load Razorpay checkout script. Please check your network or adblocker/CSP settings.")), { once: true });
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error("Razorpay script load timed out. Please check your internet connection or adblocker."));
    }, 10000);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error("Unable to load Razorpay checkout script. Please check your network or adblocker/CSP settings."));
    };
    document.body.appendChild(script);
  });
};

/**
 * Initiates Razorpay checkout flow with full error handling & status callbacks
 */
export const startCheckout = async (
  planType: PaidPlanType,
  prefill: { name?: string | null; email?: string | null },
  onSuccess?: () => void,
  onDismiss?: () => void
): Promise<void> => {
  // Pre-load script before creating order
  await loadRazorpay();
  if (!window.Razorpay) {
    throw new Error("Razorpay checkout engine is unavailable. Please refresh and try again.");
  }

  const createOrder = httpsCallable<{ planType: PaidPlanType }, PaymentOrderResult>(functions, "createPaymentOrder");
  const { data } = await createOrder({ planType });

  return new Promise((resolve, reject) => {
    const options: Record<string, unknown> = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "AIVI Labs",
      description: `AIVI ${planType === "pro" ? "Pro" : "Starter"} Subscription`,
      order_id: data.orderId,
      prefill: {
        name: prefill.name ?? "",
        email: prefill.email ?? "",
      },
      theme: {
        color: "#169C8F",
      },
      handler: function (response: any) {
        console.log("[Checkout Success] Payment Captured:", response.razorpay_payment_id);
        if (onSuccess) onSuccess();
        resolve();
      },
      modal: {
        ondismiss: function () {
          console.log("[Checkout Cancelled] User closed Razorpay modal.");
          if (onDismiss) onDismiss();
          resolve();
        },
      },
    };

    try {
      const razorpay = new window.Razorpay!(options);
      razorpay.open();
    } catch (err: any) {
      console.error("[Checkout Exception] Failed to open Razorpay modal:", err);
      reject(new Error("Failed to open Razorpay modal. Please check browser pop-up settings or retry."));
    }
  });
};

