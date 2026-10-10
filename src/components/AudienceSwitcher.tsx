import { useLocation } from "react-router-dom";
import { User, Building2 } from "lucide-react";

interface AudienceSwitcherProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function AudienceSwitcher({ variant = "light", className = "" }: AudienceSwitcherProps) {
  const location = useLocation();
  const isForColleges = location.pathname === "/for-colleges";

  const CAMPUS_URL = typeof window !== "undefined" && window.location.hostname.includes("staging")
    ? "https://staging.aivicampus.com"
    : "https://aivicampus.com";

  const containerStyle =
    variant === "dark"
      ? "bg-white/10 border-white/20 text-white"
      : "bg-slate-200/70 border-slate-300/80 text-slate-700";

  const activeStyle =
    variant === "dark"
      ? "bg-white text-slate-950 font-extrabold shadow-sm"
      : "bg-white text-slate-900 font-extrabold shadow-xs";

  const inactiveStyle =
    variant === "dark"
      ? "text-slate-300 hover:text-white font-medium"
      : "text-slate-600 hover:text-slate-900 font-medium";

  return (
    <div className={`inline-flex items-center p-1 rounded-full border text-xs ${containerStyle} ${className}`}>
      <a
        href="/"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
          !isForColleges ? activeStyle : inactiveStyle
        }`}
      >
        <User className="h-3.5 w-3.5" />
        <span>For Individuals</span>
      </a>
      <a
        href={CAMPUS_URL}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
          isForColleges ? activeStyle : inactiveStyle
        }`}
      >
        <Building2 className="h-3.5 w-3.5" />
        <span>For Colleges (B2B)</span>
      </a>
    </div>
  );
}
