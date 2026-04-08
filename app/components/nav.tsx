"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ResumeModal } from "./resume-modal";

export const Navigation: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const [showResumeModal, setShowResumeModal] = useState(false);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<>
			<header ref={ref}>
				<div
					className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md duration-200 border-b ${
						isIntersecting
							? "bg-cream-50/0 border-transparent"
							: "bg-cream-50/80 border-matcha-200/30"
					}`}
				>
					<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
						<div className="flex justify-between gap-8">
							<Link
								href="/#projects"
								className="duration-200 text-matcha-700 hover:text-matcha-900 font-light"
							>
								Projects
							</Link>
							<button
								onClick={() => setShowResumeModal(true)}
								className="duration-200 text-matcha-700 hover:text-matcha-900 font-light"
							>
								Resume
							</button>
							<Link
								href="/#contact"
								className="duration-200 text-matcha-700 hover:text-matcha-900 font-light"
							>
								Contact
							</Link>
						</div>

						<Link
							href="/"
							className="duration-200 text-matcha-600 hover:text-matcha-900"
						>
							<ArrowLeft className="w-6 h-6" />
						</Link>
					</div>
				</div>
			</header>

			<ResumeModal open={showResumeModal} onClose={() => setShowResumeModal(false)} />
		</>
	);
};
