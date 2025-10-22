"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

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
					className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
						isIntersecting
							? "bg-zinc-900/0 border-transparent"
							: "bg-zinc-900/500  border-zinc-800 "
					}`}
				>
					<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
						<div className="flex justify-between gap-8">
							<Link
								href="/#projects"
								className="duration-200 text-zinc-400 hover:text-zinc-100"
							>
								Projects
							</Link>
							<button
								onClick={() => setShowResumeModal(true)}
								className="duration-200 text-zinc-400 hover:text-zinc-100"
							>
								Resume
							</button>
							<Link
								href="/#contact"
								className="duration-200 text-zinc-400 hover:text-zinc-100"
							>
								Contact
							</Link>
						</div>

						<Link
							href="/"
							className="duration-200 text-zinc-300 hover:text-zinc-100"
						>
							<ArrowLeft className="w-6 h-6 " />
						</Link>
					</div>
				</div>
			</header>

			{/* Resume Modal */}
			{showResumeModal && (
				<div 
					className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
					style={{ animation: 'fadeIn 0.2s ease-in-out' }}
					onClick={() => setShowResumeModal(false)}
				>
					<div 
						className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
						style={{ animation: 'fadeIn 0.3s ease-in-out' }}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close button */}
						<button
							onClick={() => setShowResumeModal(false)}
							className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition-colors p-2 hover:bg-zinc-700/50 rounded-lg"
							aria-label="Close"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						<div className="text-center">
							{/* Icon */}
							<div className="mx-auto w-16 h-16 bg-zinc-700/50 rounded-full flex items-center justify-center mb-6">
								<svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>

							<h3 className="text-2xl font-bold text-zinc-100 mb-2">My Resume</h3>
							<p className="text-zinc-400 mb-8 text-sm">
								View my qualifications, experience, and skills
							</p>

							{/* Action buttons */}
							<div className="space-y-3">
								<a
									href="/Ryan%20Nguyen%20Resume%202025.pdf"
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
								>
									<span className="flex items-center justify-center gap-2">
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
										View Resume
									</span>
								</a>
								
								<a
									href="/Ryan%20Nguyen%20Resume%202025.pdf"
									download="Ryan_Nguyen_Resume.pdf"
									className="block w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
								>
									<span className="flex items-center justify-center gap-2">
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
										</svg>
										Download PDF
									</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
