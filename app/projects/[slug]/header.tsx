"use client";
import { ArrowLeft, Eye, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type Props = {
	project: {
		url?: string;
		title: string;
		description: string;
		repository?: string;
	};

	views: number;
};
export const Header: React.FC<Props> = ({ project, views }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	const links: { label: string; href: string }[] = [];
	if (project.repository) {
		links.push({
			label: "GitHub",
			href: `https://github.com/${project.repository}`,
		});
	}
	if (project.url) {
		links.push({
			label: "Website",
			href: project.url,
		});
	}
	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref} className="relative overflow-hidden">
			{/* Paper texture — same source as body */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: "url('/paper.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
			{/* Warm cream tint */}
			<div className="absolute inset-0 bg-gradient-to-b from-cream-200/50 via-card/35 to-paper/10" />
			{/* Sunlight radial — top-left, mirrors home page ambient layer */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_25%_15%,rgba(255,250,235,0.5),transparent)]" />
			{/* Matcha glow — top-right corner */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_8%,rgba(167,196,154,0.22),transparent_48%)]" />
			{/* Latte warmth — bleeds up from bottom */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_35%_at_50%_110%,rgba(211,188,162,0.3),transparent)]" />
			{/* Bottom edge — fades into body */}
			<div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-paper/50 pointer-events-none" />
			<div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-latte/55 to-transparent" />

			{/* Fixed nav */}
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b ${
					isIntersecting
						? "bg-paper/0 border-transparent"
						: "bg-paper/85 border-line/40 lg:border-transparent"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						<span
							title="View counter for this page"
							className="duration-200 flex items-center gap-1 text-subink"
						>
							{/* <Eye className="w-5 h-5" />{" "}
							{Intl.NumberFormat("en-US", { notation: "compact" }).format(
								views,
							)} */}
						</span>
						<Link target="_blank" href="https://www.linkedin.com/in/ryannguyenuog/" className="group relative inline-flex flex-col items-center p-1">
							<Linkedin className="w-6 h-6 duration-200 text-subink hover:text-matcha relative z-10" />
							<span className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-85 group-focus-visible:opacity-85 rounded-sm bg-[rgba(90,75,60,0.8)] [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_3px)] [filter:blur(0.4px)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] z-10" />
							<span className="pointer-events-none absolute bottom-[1px] left-0 right-3 h-[1.5px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 rounded-sm bg-[rgba(120,105,90,0.4)] [filter:blur(0.2px)] z-10" />
						</Link>
						<Link target="_blank" href="https://github.com/rnguyen03" className="group relative inline-flex flex-col items-center p-1">
							<Github className="w-6 h-6 duration-200 text-subink hover:text-matcha relative z-10" />
							<span className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-85 group-focus-visible:opacity-85 rounded-sm bg-[rgba(90,75,60,0.8)] [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_3px)] [filter:blur(0.4px)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] z-10" />
							<span className="pointer-events-none absolute bottom-[1px] left-0 right-3 h-[1.5px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 rounded-sm bg-[rgba(120,105,90,0.4)] [filter:blur(0.2px)] z-10" />
						</Link>
					</div>

					<Link href="/#projects" className="duration-200 text-subink hover:text-matcha">
						<ArrowLeft className="w-6 h-6" />
					</Link>
				</div>
			</div>

			{/* Hero content */}
			<div className="relative container mx-auto py-28 sm:py-36">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					{/* Section label */}
					<p className="text-[15px] tracking-[0.25em] uppercase text-matcha/60 font-light mb-5">
						Project
					</p>

					<div className="mx-auto max-w-2xl">
						<h1
							className="text-4xl font-bold tracking-tight text-matcha-dark sm:text-6xl font-display"
							style={{ textShadow: "0 2px 12px rgba(95, 125, 78, 0.18)" }}
						>
							{project.title}
						</h1>

						{/* Decorative rule */}
						<div className="flex items-center justify-center gap-3 mt-7">
							<div className="w-20 h-px bg-gradient-to-r from-transparent to-latte/70" />
							<div className="w-1.5 h-1.5 rounded-full bg-matcha/35" />
							<div className="w-20 h-px bg-gradient-to-l from-transparent to-latte/70" />
						</div>

						<p className="mt-6 text-lg leading-8 text-subink font-light">
							{project.description}
						</p>
					</div>

					{links.length > 0 && (
						<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
							<div className="grid grid-cols-1 gap-y-6 gap-x-8 text-sm font-medium leading-7 text-matcha tracking-wide sm:grid-cols-2 md:flex lg:gap-x-10">
								{links.map((link) => (
									<Link
										target="_blank"
										key={link.label}
										href={link.href}
										className="group relative inline-flex items-center hover:text-matcha-dark transition-colors duration-200"
									>
										<span className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-85 group-focus-visible:opacity-85 rounded-sm bg-[rgba(90,75,60,0.8)] [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_3px)] [filter:blur(0.4px)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] z-10" />
										<span className="pointer-events-none absolute bottom-[1px] left-0 right-4 h-[1.5px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 rounded-sm bg-[rgba(120,105,90,0.4)] [filter:blur(0.2px)] z-10" />
										<span className="relative z-20">{link.label} <span aria-hidden="true">&rarr;</span></span>
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
