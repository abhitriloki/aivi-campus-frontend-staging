import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { startCheckout } from "@/services/paymentService";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysisType?: string;
}

const UpgradeModal = ({ open, onOpenChange, analysisType }: UpgradeModalProps) => {
  const { user, loading } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);

  const isCampus = typeof window !== "undefined" && (
    window.location.pathname.startsWith("/campus") ||
    window.location.hostname.includes("aivicampus.com") ||
    Boolean(localStorage.getItem("aivi_active_tenant"))
  );

  const handleUpgrade = async () => {
    if (loading) {
      toast.info("Verifying authentication status...");
      return;
    }

    if (isCampus) {
      toast.success("Institutional Account Active: All modules are fully unlocked under your college license.");
      onOpenChange(false);
      return;
    }

    if (!user) {
      toast.info("Please sign in or create an account to upgrade your plan.");
      sessionStorage.setItem("pending_checkout_plan", "starter");
      window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}&plan=starter`;
      return;
    }

    setCheckingOut(true);
    try {
      window.gtag?.("event", "upgrade_clicked", { from_page: analysisType || "unknown" });
      await startCheckout(
        "starter",
        { name: user.displayName, email: user.email },
        () => {
          toast.success("Payment authorized! Your plan is being upgraded.");
          onOpenChange(false);
        },
        () => {
          toast.info("Checkout dismissed.");
        }
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start checkout");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-fit">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            {isCampus ? "Campus Institutional License Active" : "You've used your free career insights"}
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            {isCampus
              ? "All career intelligence modules and AI features are provided and fully unlocked by your placement cell."
              : "Upgrade to Starter for unlimited career growth tools and full AI analysis across all modules."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <button
            type="button"
            onClick={isCampus ? () => onOpenChange(false) : handleUpgrade}
            disabled={checkingOut}
            className="flex items-center justify-center gap-2 w-full bg-gradient-primary text-primary-foreground py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-4 w-4" />
            {isCampus ? "Continue with Campus License" : checkingOut ? "Starting checkout..." : "Upgrade to Starter - ₹399/mo"}
            <ArrowRight className="h-4 w-4" />
          </button>
          {!isCampus && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center gap-2 w-full border border-border text-foreground py-3 rounded-lg font-medium text-sm hover:bg-secondary transition-colors"
            >
              Continue on free plan
            </button>
          )}
          <div className="pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              {isCampus ? "Managed by your university placement cell" : "Payments are created and verified server-side."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
