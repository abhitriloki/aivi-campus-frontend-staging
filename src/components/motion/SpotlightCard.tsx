import { useRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * SpotlightCard — card whose ::before radial highlight follows the pointer.
 * Pair with the `.spotlight-card` CSS class (JS sets --mx / --my).
 */
export default function SpotlightCard({
  children,
  className,
  ...rest
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn("spotlight-card", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
