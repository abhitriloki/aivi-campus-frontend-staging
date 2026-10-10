import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";

const PromoBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const isDismissed = localStorage.getItem("aivi_promo_dismissed");
        if (isDismissed) {
            setIsVisible(false);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("aivi_promo_dismissed", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="relative z-[60] border-b border-white/8 bg-[#0E161D] text-[#E7ECEF]">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 text-center text-sm">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B5965A]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Beta access
                </div>
                <p className="max-w-3xl text-[#D1D8DD]">
                    First 1000 users receive full-platform early access with code{" "}
                    <span className="font-semibold tracking-[0.16em] text-[#F4EFE7]">FIRST1000</span>
                </p>
                <Link
                    to="/#pricing"
                    className="hidden items-center gap-2 text-sm font-semibold text-[#8FD1C7] transition-colors hover:text-white md:inline-flex"
                >
                    View pricing
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <button
                onClick={handleDismiss}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#AAB4BB] transition-colors hover:bg-white/8 hover:text-white md:right-4"
                aria-label="Dismiss banner"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default PromoBanner;
