"use client";

import {
  animate,
  cubicBezier,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Project card with cursor-lit embossed paper effect
export const Card: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const DEBUG_RING = false; // toggle to false to disable the visible debug edge
  const recenterToken = useRef(0);

  // one source of truth for hover state easing
  const hoverProgress = useSpring(0, { stiffness: 220, damping: 26, mass: 0.25 });

  // derive all opacities from it (you can shape them if you want)
  const darkA      = useTransform(hoverProgress, [0, 1], [0, 1]);
  const tintA      = useTransform(hoverProgress, [0, 1], [0, 0.25]);
  const spotA      = useTransform(hoverProgress, [0, 1], [0, 1]);
  const shadowA    = useTransform(hoverProgress, [0, 1], [0, 1]);
  const textureA   = useTransform(hoverProgress, [0, 1], [0, 0.15]);

  // optional: coordinate the lift/back-to-rest with the same progress
  const liftY      = useTransform(hoverProgress, [0, 1], [0, -3]);

  // Immediate tracking values + smoothed springs for tilt
  const mxRaw = useMotionValue<number>(0.5);
  const myRaw = useMotionValue<number>(0.5);
  const mx = useSpring(mxRaw, { stiffness: 360, damping: 26, mass: 0.18 });
  const my = useSpring(myRaw, { stiffness: 360, damping: 26, mass: 0.18 });

  // Cursor direction from center: -1..1 (left/right, top/bottom)
  const dx = useTransform(mxRaw, (v) => (v - 0.5) * 2); // -1 = left, +1 = right
  const dy = useTransform(myRaw, (v) => (v - 0.5) * 2); // -1 = top,  +1 = bottom

  // Shadow vector points *away* from the light (cursor), so negate dx/dy
  const maxOffset = 18;               // px at full hover near the edge
  const contactBlurRange = [1, 6];    // tighter, near the card
  const ambientBlurRange = [12, 36];  // softer, wider falloff

  // Offsets scale with both cursor direction and hover amount
  const shadowOffsetX = useTransform([dx, hoverProgress], (values: number[]) => -values[0] * values[1] * maxOffset);
  const shadowOffsetY = useTransform([dy, hoverProgress], (values: number[]) => -values[0] * values[1] * maxOffset);

  // Blurs grow with hoverProgress (more lift ⇒ softer, larger shadow)
  const contactBlur = useTransform(hoverProgress, [0, 1], contactBlurRange);
  const ambientBlur = useTransform(hoverProgress, [0, 1], ambientBlurRange);

  // Opacity also tied to hover; ambient is softer than contact
  const contactAlpha = useTransform(hoverProgress, [0, 1], [0.05, 0.20]);
  const ambientAlpha = useTransform(hoverProgress, [0, 1], [0.08, 0.30]);

  // Slightly larger offset for the ambient layer to sell depth
  const ambientOffsetX = useTransform([shadowOffsetX, hoverProgress], (values: number[]) => values[0] * (1 + 0.25 * values[1]));
  const ambientOffsetY = useTransform([shadowOffsetY, hoverProgress], (values: number[]) => values[0] * (1 + 0.25 * values[1]));

  // Compose a dynamic, cursor-aware boxShadow (two layers)
  const boxShadowV = useMotionTemplate`
    ${shadowOffsetX}px ${shadowOffsetY}px ${contactBlur}px rgba(0,0,0, ${contactAlpha}),
    ${ambientOffsetX}px ${ambientOffsetY}px ${ambientBlur}px rgba(0,0,0, ${ambientAlpha})
  `;

  // Opposite-edge emphasis (near edge fades, opposite edge strengthens)
  const wLeft   = useTransform(dx, (v) => Math.max(0,  v));  // cursor -> right ⇒ shadow on left
  const wRight  = useTransform(dx, (v) => Math.max(0, -v));  // cursor -> left  ⇒ shadow on right
  const wTop    = useTransform(dy, (v) => Math.max(0,  v));  // cursor -> bottom⇒ shadow on top
  const wBottom = useTransform(dy, (v) => Math.max(0, -v));  // cursor -> top   ⇒ shadow on bottom

  // Scale each edge weight by global shadowA and a cap (feel free to tune)
  const edgeAlphaL = useTransform([wLeft,  shadowA], ([w,a]: number[]) => w * a * 0.18);
  const edgeAlphaR = useTransform([wRight, shadowA], ([w,a]: number[]) => w * a * 0.18);
  const edgeAlphaT = useTransform([wTop,   shadowA], ([w,a]: number[]) => w * a * 0.14);
  const edgeAlphaB = useTransform([wBottom,shadowA], ([w,a]: number[]) => w * a * 0.14);

  // Subtle 3D tilt
  const rX = useTransform(my, [0, 1], [1.2, -1.2]);
  const rY = useTransform(mx, [0, 1], [-1.2, 1.2]);

  // Spotlight (at cursor) and drifting shadow (offset from cursor)
  // Use raw values for instant cursor follow
  const sx = useTransform(mxRaw, [0, 1], [0, 100]);
  const sy = useTransform(myRaw, [0, 1], [0, 100]);
  const shx = useTransform(mxRaw, [0, 1], [8, 142]);
  const shy = useTransform(myRaw, [0, 1], [12, 146]);

  // Smaller, brighter spotlight + softer shadow
  const spotlight = useMotionTemplate`radial-gradient(260px 260px at ${sx}% ${sy}%, rgba(255,254,247,0.95) 0%, rgba(255,250,235,0.50) 30%, rgba(255,244,220,0.20) 52%, transparent 68%)`;
  const shadow = useMotionTemplate`radial-gradient(420px 420px at ${shx}% ${shy}%, rgba(96,78,58,0.10) 0%, rgba(120,100,78,0.06) 40%, transparent 64%)`;

  // Compose the edge-shadow background
  const edgeShadows = useMotionTemplate`
    linear-gradient(to right,  rgba(0,0,0, ${edgeAlphaL}) 0px, rgba(0,0,0,0) 120px),
    linear-gradient(to left,   rgba(0,0,0, ${edgeAlphaR}) 0px, rgba(0,0,0,0) 120px),
    linear-gradient(to bottom, rgba(0,0,0, ${edgeAlphaT}) 0px, rgba(0,0,0,0) 120px),
    linear-gradient(to top,    rgba(0,0,0, ${edgeAlphaB}) 0px, rgba(0,0,0,0) 120px)
  `;

  // Inline SVG paper texture encoded safely for CSS url()
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.4"/></svg>';
  const svgUrl = useMemo(
    () => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
    [],
  );

  // Subtle tonal gradient that follows the cursor (soft light ivory tint, no green)
  // Lightening tint (flipped to illuminate, no dark wedge)
  const tint = useMotionTemplate`conic-gradient(from 0deg at ${sx}% ${sy}%, rgba(255,255,250,0.20) 0deg, rgba(255,255,255,0.00) 140deg, rgba(255,250,235,0.12) 260deg, rgba(255,255,250,0.20) 360deg)`;
  const easeCurve = useMemo(() => cubicBezier(0.22, 1, 0.36, 1), []);

  const scheduleRecenter = useCallback(async () => {
    const token = ++recenterToken.current;

    // wait until progress is basically zero
    await new Promise<void>((resolve) => {
      const unsub = hoverProgress.on("change", (v) => {
        if (v <= 0.02) { unsub(); resolve(); }
      });
    });

    if (recenterToken.current !== token) return;
    mxRaw.stop(); myRaw.stop();
    animate(mxRaw, 0.5, { duration: 0.35, ease: easeCurve });
    animate(myRaw, 0.5, { duration: 0.35, ease: easeCurve });
  }, [easeCurve, hoverProgress, mxRaw, myRaw]);

  // Debug ring – a thin edge to make spotlight motion unmistakable
  const ring = useMotionTemplate`radial-gradient(260px 260px at ${sx}% ${sy}%, transparent 60%, rgba(90,70,50,0.35) 63%, rgba(90,70,50,0.35) 66%, transparent 70%)`;

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    mxRaw.set(x);
    myRaw.set(y);
  }

  function onEnter() {
    recenterToken.current++;
    setHovered(true);
    hoverProgress.set(1);          // ease up + fade in, together
  }

  function onLeave(e: React.PointerEvent<HTMLDivElement>) {
    const next = e.relatedTarget as EventTarget | null;
    if (next instanceof Node && ref.current?.contains(next)) return;

    setHovered(false);
    hoverProgress.set(0);          // ease down + fade out, together
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
        y: liftY,                 // still tied to progress
        boxShadow: boxShadowV,     // ← tie shadow to progress
      }}
    >
      {/* Base dark tone so cards are darker initially */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, rgba(80,65,50,0.12) 0%, rgba(60,50,40,0.18) 70%)",
        }}
      />

      {/* Hover darkening layer (sits under spotlight/tint to make lamp feel bright) */}
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

      {/* Subtle following tint gradient for additional depth */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
        style={{ background: tint, opacity: tintA, willChange: "opacity" }}
      />

      {/* Debug ring visualizing spotlight edge */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: ring,
          opacity: hovered && DEBUG_RING ? 1 : 0,
          transition: "opacity .15s ease-out",
        }}
      />

      {/* Spotlight following cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: spotlight,
          opacity: spotA,
          willChange: "opacity",
        }}
      />

      {/* Directional edge shadows that react to the spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: edgeShadows,
          mixBlendMode: "multiply",
          willChange: "opacity, background",
        }}
      />

      {/* Drifting shadow offset from cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: shadow, opacity: shadowA, willChange: "opacity" }}
      />

      {/* Paper fibers texture - subtle */}
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

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </motion.div>
  );
};
