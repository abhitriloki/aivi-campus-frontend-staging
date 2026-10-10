import { useEffect, useRef, useState } from "react";

/**
 * CursorGlow — premium layered cursor (inspired by the aiviintelligence.com
 * pointer). Four layers follow the pointer with different physics so the
 * motion feels liquid rather than glued:
 *
 *  1. dot   — 7px brand core, near-instant (the precise point)
 *  2. halo  — spring ring that expands over interactive targets
 *  3. aura  — wide soft teal wash that trails behind (ambient light)
 *  4. comet — medium glow that lags the most, creating a smooth comet tail
 *
 * Progressive enhancement only: fine pointers, no reduced-motion, auto-hides
 * on touch devices, and never blocks clicks.
 */
export default function CursorGlow({ intensity = "auto" }: { intensity?: "auto" | "calm" | "strong" }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const raf = useRef<number>(0);
  const s = useRef({
    x: -200,
    y: -200,
    rx: -200,
    ry: -200,
    ax: -200,
    ay: -200,
    cx: -200,
    cy: -200,
    seen: false,
  });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-glow-enabled");

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const isInteractive = (el: EventTarget | null) =>
      el instanceof Element &&
      !!el.closest(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor], [role="menuitem"], [role="tab"], [role="option"], [role="switch"], [role="checkbox"], details summary',
      );

    const show = (visible: boolean) => {
      const cls = "is-active";
      if (visible) {
        dotRef.current?.classList.add(cls);
        ringRef.current?.classList.add(cls);
        auraRef.current?.classList.add(cls);
        cometRef.current?.classList.add(cls);
      } else {
        dotRef.current?.classList.remove(cls);
        ringRef.current?.classList.remove(cls);
        auraRef.current?.classList.remove(cls);
        cometRef.current?.classList.remove(cls);
      }
    };

    const onMove = (e: MouseEvent) => {
      const st = s.current;
      if (!st.seen) {
        st.x = st.rx = st.ax = st.cx = e.clientX;
        st.y = st.ry = st.ay = st.cy = e.clientY;
        st.seen = true;
      } else {
        st.x = e.clientX;
        st.y = e.clientY;
      }
      show(true);
      const over = isInteractive(e.target);
      ringRef.current?.classList.toggle("is-hover", !!over);
      ringRef.current?.classList.toggle("is-down", e.buttons > 0);
      dotRef.current?.classList.toggle("is-hover", !!over);
    };

    const onLeave = () => {
      s.current.seen = false;
      show(false);
    };

    const tick = () => {
      const st = s.current;
      // dot: snappy
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${st.x - 3.5}px, ${st.y - 3.5}px, 0)`;
      // halo ring: medium spring
      st.rx = lerp(st.rx, st.x, 0.3);
      st.ry = lerp(st.ry, st.y, 0.3);
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${st.rx - 20}px, ${st.ry - 20}px, 0)`;
      // wide aura: slower
      st.ax = lerp(st.ax, st.x, 0.14);
      st.ay = lerp(st.ay, st.y, 0.14);
      if (auraRef.current)
        auraRef.current.style.transform = `translate3d(${st.ax - 230}px, ${st.ay - 230}px, 0)`;
      // comet tail: slowest
      st.cx = lerp(st.cx, st.x, 0.07);
      st.cy = lerp(st.cy, st.y, 0.07);
      if (cometRef.current)
        cometRef.current.style.transform = `translate3d(${st.cx - 90}px, ${st.cy - 90}px, 0)`;
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
      document.documentElement.classList.remove("cursor-glow-enabled");
    };
  }, []);

  if (!enabled) return null;

  const alpha = intensity === "strong" ? 0.2 : intensity === "calm" ? 0.08 : 0.13;
  const cometAlpha = intensity === "strong" ? 0.16 : intensity === "calm" ? 0.05 : 0.09;

  return (
    <>
      {/* comet tail (lags furthest) */}
      <div
        ref={cometRef}
        aria-hidden
        className="cursor-comet"
        style={{ background: `radial-gradient(closest-side, hsl(173 80% 55% / ${cometAlpha}), transparent 75%)` }}
      />
      {/* ambient aura */}
      <div
        ref={auraRef}
        aria-hidden
        className="cursor-aura"
        style={{ background: `radial-gradient(closest-side, hsl(173 85% 50% / ${alpha}), transparent 70%)` }}
      />
      {/* halo ring */}
      <div ref={ringRef} aria-hidden className="cursor-ring">
        <span className="cursor-ring-core" />
      </div>
      {/* precise dot */}
      <div ref={dotRef} aria-hidden className="cursor-dot" />
    </>
  );
}
