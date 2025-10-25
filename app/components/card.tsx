"use client";

import {
  animate,
  cubicBezier,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { PropsWithChildren, useCallback, useMemo, useRef, useState } from "react";

export const Card: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const recenterToken = useRef(0);

  // ---------- core easing ----------
  const hoverProgress = useSpring(0, { stiffness: 220, damping: 26, mass: 0.25 });
  const easeCurve = useMemo(() => cubicBezier(0.22, 1, 0.36, 1), []);

  // ---------- cursor (raw) + tilt springs ----------
  const mxRaw = useMotionValue(0.5);
  const myRaw = useMotionValue(0.5);
  const mx = useSpring(mxRaw, { stiffness: 360, damping: 26, mass: 0.18 });
  const my = useSpring(myRaw, { stiffness: 360, damping: 26, mass: 0.18 });

  const rX = useTransform(my, [0, 1], [1.2, -1.2]);
  const rY = useTransform(mx, [0, 1], [-1.2, 1.2]);
  const liftY = useTransform(hoverProgress, [0, 1], [0, -3]);

  // ---------- spotlight & tint ----------
  const sx = useTransform(mxRaw, [0, 1], [0, 100]);
  const sy = useTransform(myRaw, [0, 1], [0, 100]);

  const spotA    = useTransform(hoverProgress, [0, 1], [0, 1]);
  const darkA    = useTransform(hoverProgress, [0, 1], [0, 1]);
  const tintA    = useTransform(hoverProgress, [0, 1], [0, 0.25]);
  const textureA = useTransform(hoverProgress, [0, 1], [0, 0.15]);
  const shadowA  = useTransform(hoverProgress, [0, 1], [0, 1]);

  const spotlight = useMotionTemplate`
    radial-gradient(260px 260px at ${sx}% ${sy}%,
      rgba(255,254,247,0.95) 0%,
      rgba(255,250,235,0.50) 30%,
      rgba(255,244,220,0.20) 52%,
      transparent 68%)`;

  const tint = useMotionTemplate`
    conic-gradient(from 0deg at ${sx}% ${sy}%,
      rgba(255,255,250,0.20) 0deg,
      rgba(255,255,255,0.00) 140deg,
      rgba(255,250,235,0.12) 260deg,
      rgba(255,255,250,0.20) 360deg)`;


  // ---------- cursor-aware box-shadow (safe & smooth) ----------
  // directional inputs -1..1 (from center)
  const dx = useTransform(mxRaw, v => (v - 0.5) * 2);
  const dy = useTransform(myRaw, v => (v - 0.5) * 2);

  // smooth non-linear response to avoid harsh edges near corners
  const easeDir = (v: number) => Math.sign(v) * Math.min(1, Math.abs(v)) ** 1.35;

  const dirX = useTransform(dx, easeDir);
  const dirY = useTransform(dy, easeDir);

  // scale with distance from center, clamped to avoid crazy values in corners
  const dist = useTransform([dirX, dirY], ([x, y]) => {
    const d = Math.hypot(x, y);
    return Math.min(1, d); // 0..1
  });

  const maxOffset = 18; // tune
  const baseOffsetX = useTransform([dirX, hoverProgress], ([x, p]) => -x * p * maxOffset);
  const baseOffsetY = useTransform([dirY, hoverProgress], ([y, p]) => -y * p * maxOffset);

  // add a subtle push with distance so edges feel stronger when lamp is far from center
  const shadowOffsetX = useTransform([baseOffsetX, dist], ([ox, d]) => ox * (0.9 + 0.2 * d));
  const shadowOffsetY = useTransform([baseOffsetY, dist], ([oy, d]) => oy * (0.9 + 0.2 * d));

  // blurs & alphas – keep tiny non-zero floors to prevent GPU snapping at exactly 0
  const contactBlur  = useTransform(hoverProgress, [0, 1], [1, 6]);
  const ambientBlur  = useTransform(hoverProgress, [0, 1], [12, 36]);
  const contactAlpha = useTransform(hoverProgress, [0, 1], [0.0001, 0.20]);
  const ambientAlpha = useTransform(hoverProgress, [0, 1], [0.0001, 0.30]);

  const ambientOffsetX = useTransform([shadowOffsetX, hoverProgress], ([ox, p]) => ox * (1 + 0.25 * p));
  const ambientOffsetY = useTransform([shadowOffsetY, hoverProgress], ([oy, p]) => oy * (1 + 0.25 * p));

  const boxShadowV = useMotionTemplate`
    ${shadowOffsetX}px ${shadowOffsetY}px ${contactBlur}px rgba(0,0,0, ${contactAlpha}),
    ${ambientOffsetX}px ${ambientOffsetY}px ${ambientBlur}px rgba(0,0,0, ${ambientAlpha})
  `;

  // ---------- optional directional edge shading (kept; safe by design) ----------
  const wLeft   = useTransform(dx,  v => Math.max(0,  v));
  const wRight  = useTransform(dx,  v => Math.max(0, -v));
  const wTop    = useTransform(dy,  v => Math.max(0,  v));
  const wBottom = useTransform(dy,  v => Math.max(0, -v));

  const edgeAlphaL = useTransform([wLeft,  shadowA],  ([w, a]) => w * a * 0.18);
  const edgeAlphaR = useTransform([wRight, shadowA],  ([w, a]) => w * a * 0.18);
  const edgeAlphaT = useTransform([wTop,   shadowA],  ([w, a]) => w * a * 0.14);
  const edgeAlphaB = useTransform([wBottom,shadowA],  ([w, a]) => w * a * 0.14);

  const edgeShadows = useMotionTemplate`
    linear-gradient(to right,  rgba(0,0,0, ${edgeAlphaL}) 0px, rgba(0,0,0,0) 120px),
    linear-gradient(to left,   rgba(0,0,0, ${edgeAlphaR}) 0px, rgba(0,0,0,0) 120px),
    linear-gradient(to bottom, rgba(0,0,0, ${edgeAlphaT}) 0px, rgba(0,0,0,0) 120px),
    linear-gradient(to top,    rgba(0,0,0, ${edgeAlphaB}) 0px, rgba(0,0,0,0) 120px)
  `;

  // ---------- tiny noise texture ----------
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.4"/></svg>';
  const svgUrl = useMemo(() => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`, []);

  // ---------- robust recenter (no race) ----------
  const scheduleRecenter = useCallback(async () => {
    const token = ++recenterToken.current;
    // wait until progress basically reaches 0 (spring settled)
    await new Promise<void>((resolve) => {
      const unsub = hoverProgress.on("change", (v) => { if (v <= 0.02) { unsub(); resolve(); } });
    });
    if (recenterToken.current !== token) return;
    mxRaw.stop(); myRaw.stop();
    animate(mxRaw, 0.5, { duration: 0.35, ease: easeCurve });
    animate(myRaw, 0.5, { duration: 0.35, ease: easeCurve });
  }, [hoverProgress, easeCurve, mxRaw, myRaw]);

  // ---------- pointer handling (rAF throttled; no floods) ----------
  const tick = useRef(false);
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    if (tick.current) return;
    tick.current = true;
    requestAnimationFrame(() => {
      const rect = ref.current!.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      mxRaw.set(x);
      myRaw.set(y);
      tick.current = false;
    });
  }

  function onEnter() {
    recenterToken.current++;
    setHovered(true);
    hoverProgress.set(1);
  }

  function onLeave(e: React.PointerEvent<HTMLDivElement>) {
    const next = e.relatedTarget as EventTarget | null;
    if (next instanceof Node && ref.current?.contains(next)) return;
    setHovered(false);
    hoverProgress.set(0);
    void scheduleRecenter();
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className="relative overflow-hidden rounded-2xl border-2 border-matcha-300/40 bg-clip-padding"
      style={{
        backgroundImage: "url(/paper.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        rotateX: rX,
        rotateY: rY,
        transformStyle: "preserve-3d",
        willChange: "transform, box-shadow",
        y: liftY,
        boxShadow: boxShadowV, // dynamic, cursor-aware, race-safe
      }}
    >
      {/* base tone */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, rgba(80,65,50,0.12) 0%, rgba(60,50,40,0.18) 70%)",
        }}
      />

      {/* darkening underlay */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          opacity: darkA,
          background:
            "linear-gradient(180deg, rgba(110, 90, 70, 0.18) 0%, rgba(80, 65, 50, 0.22) 100%)",
          willChange: "opacity",
        }}
      />

      {/* tint */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
        style={{ background: tint, opacity: tintA, willChange: "opacity" }}
      />

      {/* spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: spotlight, opacity: spotA, willChange: "opacity" }}
      />

      {/* directional edge shading */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: edgeShadows,
          mixBlendMode: "multiply",
          willChange: "opacity, background",
        }}
      />

      {/* soft radial shadow field (still nice) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(420px 420px at ${useTransform(mxRaw, [0,1],[8,142])}% ${useTransform(myRaw, [0,1],[12,146])}%,
              rgba(96,78,58,0.10) 0%,
              rgba(120,100,78,0.06) 40%,
              transparent 64%)`,
          opacity: shadowA,
          willChange: "opacity",
        }}
      />

      {/* paper fibers */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          opacity: textureA,
          backgroundImage: svgUrl,
          backgroundSize: "180px 180px",
          willChange: "opacity",
        }}
      />

      <div className="relative z-20">{children}</div>
    </motion.div>
  );
};
