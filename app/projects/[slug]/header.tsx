"use client";
import { ArrowLeft, Github, Linkedin } from "lucide-react";
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
		<header
			ref={ref}
			className="relative isolate overflow-hidden bg-gradient-to-br from-[#2f251f] via-[#3b2e26] to-[#2a221c]"

		>
			{/* Soft café glow over the espresso hero */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-70"
				style={{
					background:
						"radial-gradient(60% 60% at 20% 30%, rgba(255,250,235,0.16) 0%, transparent 65%), radial-gradient(55% 55% at 80% 20%, rgba(167,196,154,0.12) 0%, transparent 70%)",
				}}
			/>

			<div
				className={`fixed inset-x-0 top-0 z-50 duration-200 border-b ${
					isIntersecting
						? "bg-transparent border-transparent"
						: "bg-cream/80 backdrop-blur-md border-line/50"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						<Link
							target="_blank"
							rel="noopener noreferrer"
							href="https://www.linkedin.com/in/ryannguyenuog/"
							aria-label="Open LinkedIn profile"
							className={`rounded-xl p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha/45 focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
								isIntersecting
									? "text-cream-200/80 hover:text-cream-50"
									: "text-matcha-700 hover:text-matcha-dark"
							}`}
						>
							<Linkedin
								className="w-6 h-6"
							/>
						</Link>
						<Link
							target="_blank"
							rel="noopener noreferrer"
							href="https://github.com/rnguyen03"
							aria-label="Open GitHub profile"
							className={`rounded-xl p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha/45 focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
								isIntersecting
									? "text-cream-200/80 hover:text-cream-50"
									: "text-matcha-700 hover:text-matcha-dark"
							}`}
						>
							<Github
								className="w-6 h-6"
							/>
						</Link>
					</div>

					<Link
						href="/#projects"
						aria-label="Back to projects"
						className={`rounded-xl p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha/45 focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
							isIntersecting
								? "text-cream-200/80 hover:text-cream-50"
								: "text-matcha-700 hover:text-matcha-dark"
						}`}
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>
				</div>
			</div>
			<div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h1 className="text-4xl font-semibold tracking-tight text-cream-50 sm:text-6xl font-display">
							{project.title}
						</h1>
						<p className="mt-6 text-base sm:text-lg leading-relaxed text-cream-200/85 font-light">
							{project.description}
						</p>
					</div>

					<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
						<div className="grid grid-cols-1 gap-y-3 gap-x-8 text-sm font-medium leading-7 text-cream-50 sm:grid-cols-2 md:flex lg:gap-x-10">
							{links.map((link) => (
								<Link
									target="_blank"
									rel="noopener noreferrer"
									key={link.label}
									href={link.href}
									className="inline-flex items-center gap-2 rounded-full border border-cream-200/20 bg-cream-50/5 px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream-50/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
								>
									{link.label}
									<span aria-hidden="true" className="text-cream-200/70">
										→
									</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
