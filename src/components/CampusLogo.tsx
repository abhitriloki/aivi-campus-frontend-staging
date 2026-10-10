import { cn } from "@/lib/utils";
import campusLogoTransparent from "@/assets/aivi-campus-logo.png";
import campusLogoSolid from "@/assets/aivi-campus-logo-card.png";

/**
 * The official AIVI Campus logo (Emblemed monogram + AiVi CAMPUS wordmark + tagline).
 * Transparent version used by default, sitting seamlessly over dark and light backgrounds.
 */
export default function CampusLogo({
  className,
  onDark = false,
  imgClassName,
  tile = false,
  useSolid = false,
}: {
  className?: string;
  onDark?: boolean;
  imgClassName?: string;
  /** force white tile if explicitly requested */
  tile?: boolean;
  useSolid?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center leading-none transition-transform duration-200",
        tile &&
          "rounded-xl bg-white p-1.5 shadow-[0_2px_10px_rgba(16,24,32,0.18),inset_0_0_0_1px_rgba(16,24,32,0.06)]",
        className,
      )}
    >
      <img
        src={useSolid ? campusLogoSolid : campusLogoTransparent}
        alt="AIVI Campus — Employability OS for Indian Colleges & Universities"
        className={cn("h-full w-auto object-contain drop-shadow-[0_2px_12px_rgba(32,207,192,0.15)]", imgClassName)}
        draggable={false}
      />
    </span>
  );
}
