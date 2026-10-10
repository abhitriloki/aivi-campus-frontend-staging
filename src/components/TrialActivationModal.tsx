import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applyCoupon } from "@/services/planService";
import { toast } from "sonner";
import { Sparkles, Ticket } from "lucide-react";

interface TrialActivationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const TrialActivationModal = ({
    open,
    onOpenChange,
    onSuccess,
}: TrialActivationModalProps) => {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleApply = async () => {
        if (!code) {
            toast.error("Please enter a coupon code");
            return;
        }

        setIsLoading(true);
        try {
            const result = await applyCoupon(code);
            if (result.success) {
                if (typeof window !== "undefined" && (window as any).gtag) {
                    (window as any).gtag('event', 'trial_activated');
                }
                toast.success(result.message);
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(result.message || "Failed to apply coupon");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Activate Beta Trial
                    </DialogTitle>
                    <DialogDescription>
                        Enter your special coupon code to unlock 30 days of Starter features for free.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Enter code (e.g. FIRST1000)"
                                className="pl-10"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleApply();
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center">
                            *Limited to the first 1000 users. No credit card required.
                        </p>
                    </div>
                    <Button
                        className="w-full bg-gradient-primary"
                        onClick={handleApply}
                        disabled={isLoading}
                    >
                        {isLoading ? "Activating..." : "Activate Now"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TrialActivationModal;
