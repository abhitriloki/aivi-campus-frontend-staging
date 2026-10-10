import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Reveal — fades / slides content into view the first time it enters the
 * viewport. Everything else stays perfectly static (SSR-safe, a11y friendly
 * because reduced-motion is respected).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 26,
  x = 0,
  className = "",
  as: Tag = "div",
  once = true,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "header" | "article";
  once?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const TagEl: any = Tag;
  return (
    <TagEl
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translate3d(${x}px, ${y}px, 0)`,
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </TagEl>
  );
}
