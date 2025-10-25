"use client";
import {
	motion,
	useMotionTemplate,
	useSpring,
	useTransform,
	useMotionValue,
	animate,
} from "framer-motion";

import { PropsWithChildren, useMemo, useRef, useState } from "react";

// Project card with cursor-lit embossed paper effect
export const Card: React.FC<PropsWithChildren> = ({ children }) => {
	const ref = useRef<HTMLDivElement>(null);
	const [hovered, setHovered] = useState(false);
	const DEBUG_RING = false; // toggle to false to disable the visible debug edge
	const recenterTimeout = useRef<number | null>(null);

		// Immediate tracking values + smoothed springs for tilt
		const mxRaw = useMotionValue(0.5);
		const myRaw = useMotionValue(0.5);
		const mx = useSpring(mxRaw, { stiffness: 360, damping: 26, mass: 0.18 });
		const my = useSpring(myRaw, { stiffness: 360, damping: 26, mass: 0.18 });

	// Subtle 3D tilt
	const rX = useTransform(my, [0, 1], [1.2, -1.2]);
	const rY = useTransform(mx, [0, 1], [-1.2, 1.2]);

		// Spotlight (at cursor) and drifting shadow (offset from cursor)
		// Use raw values for instant cursor follow
		const sx = useTransform(mxRaw, [0, 1], [0, 100]);
		const sy = useTransform(myRaw, [0, 1], [0, 100]);
		const shx = useTransform(mxRaw, [0, 1], [18, 128]);
		const shy = useTransform(myRaw, [0, 1], [24, 132]);

		// Smaller, brighter spotlight + softer shadow
		const spotlight = useMotionTemplate`radial-gradient(260px 260px at ${sx}% ${sy}%, rgba(255,254,247,0.95) 0%, rgba(255,250,235,0.50) 30%, rgba(255,244,220,0.20) 52%, transparent 68%)`;
		const shadow = useMotionTemplate`radial-gradient(420px 420px at ${shx}% ${shy}%, rgba(96,78,58,0.10) 0%, rgba(120,100,78,0.06) 40%, transparent 64%)`;

		// Inline SVG paper texture encoded safely for CSS url()
		const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.4"/></svg>';
		const svgUrl = useMemo(() => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`, []);

			// Subtle tonal gradient that follows the cursor (soft light ivory tint, no green)
				// Lightening tint (flipped to illuminate, no dark wedge)
				const tint = useMotionTemplate`conic-gradient(from 0deg at ${sx}% ${sy}%, rgba(255,255,250,0.20) 0deg, rgba(255,255,255,0.00) 140deg, rgba(255,250,235,0.12) 260deg, rgba(255,255,250,0.20) 360deg)`;

			// Debug ring – a thin edge to make spotlight motion unmistakable
				const ring = useMotionTemplate`radial-gradient(260px 260px at ${sx}% ${sy}%, transparent 60%, rgba(90,70,50,0.35) 63%, rgba(90,70,50,0.35) 66%, transparent 70%)`;

		function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
		if (!ref.current) return;
		const rect = ref.current.getBoundingClientRect();
			// clamp into 0..1 range
			const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
			const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
			mxRaw.set(x);
			myRaw.set(y);
	}

	function onEnter() {
		setHovered(true);
		// if a delayed recenter was scheduled, cancel it
		if (recenterTimeout.current) {
			clearTimeout(recenterTimeout.current);
			recenterTimeout.current = null;
		}
	}
	function onLeave() {
		setHovered(false);
			// Let the shadow/spotlight fade out in place, then recenter after fade completes
			if (recenterTimeout.current) clearTimeout(recenterTimeout.current);
			recenterTimeout.current = window.setTimeout(() => {
				animate(mxRaw, 0.5, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
				animate(myRaw, 0.5, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
				recenterTimeout.current = null;
			}, 700); // wait longer than the shadow fade (0.65s)
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
				willChange: "transform",
			}}
			animate={{
				y: hovered ? -3 : 0,
				boxShadow: hovered
					? "0 2px 2px rgba(0,0,0,.06), 0 18px 36px rgba(0, 0, 0, 0.4)"
					: "0 1px 0 rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.08)",
			}}
			transition={{ 
				type: "spring", 
				stiffness: 260, 
				damping: 28,
				boxShadow: { duration: 0.55, ease: "easeInOut" },
				y: { type: "spring", stiffness: 260, damping: 28 }
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
							background:
								"linear-gradient(180deg, rgba(110, 90, 70, 0.18) 0%, rgba(80, 65, 50, 0.22) 100%)",
						}}
						animate={{ opacity: hovered ? 1 : 0 }}
						transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
					/>

					{/* Subtle following tint gradient for additional depth */}
											<motion.div
												aria-hidden
												className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
												style={{ background: tint }}
												animate={{ opacity: hovered ? 0.25 : 0 }}
												transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
											/>

							{/* Debug ring visualizing spotlight edge */}
							<motion.div
								aria-hidden
								className="pointer-events-none absolute inset-0 z-20"
								style={{ background: ring, opacity: hovered && DEBUG_RING ? 1 : 0, transition: "opacity .15s ease-out" }}
							/>

					{/* Spotlight following cursor */}
					<motion.div
						aria-hidden
						className="pointer-events-none absolute inset-0 z-10"
						style={{ background: spotlight }}
						animate={{ opacity: hovered ? 1 : 0 }}
						transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
					/>

			{/* Drifting shadow offset from cursor */}
					<motion.div
						aria-hidden
						className="pointer-events-none absolute inset-0 z-10"
						style={{ background: shadow }}
						animate={{ opacity: hovered ? 1 : 0 }}
						transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
					/>

			{/* Paper fibers texture - subtle */}
					<motion.div
						aria-hidden
						className="pointer-events-none absolute inset-0 z-10"
						style={{
							backgroundImage: svgUrl,
							backgroundSize: "180px 180px",
						}}
						animate={{ opacity: hovered ? 0.15 : 0 }}
						transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
					/>

			{/* Content */}
			<div className="relative z-20">
				{children}
			</div>
		</motion.div>
	);
};
