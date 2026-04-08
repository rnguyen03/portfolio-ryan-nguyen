"use client";

import React, { useEffect, useId, useRef } from "react";

type ResumeModalProps = {
	open: boolean;
	onClose: () => void;
};

export const ResumeModal: React.FC<ResumeModalProps> = ({ open, onClose }) => {
	const titleId = useId();
	const descriptionId = useId();
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		document.addEventListener("keydown", handleKeyDown);

		// Ensure initial focus lands inside the dialog.
		requestAnimationFrame(() => {
			closeButtonRef.current?.focus();
		});

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="resume-overlay fixed inset-0 z-[100] flex items-center justify-center bg-ink/35 backdrop-blur-sm px-4 py-8"
			style={{ animation: "overlayIn 160ms ease-out" }}
			onMouseDown={onClose}
			aria-hidden="true"
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={descriptionId}
				className="resume-panel relative w-full max-w-[520px] rounded-3xl border border-line/70 bg-gradient-to-br from-paper/95 via-card/90 to-cream-200/80 shadow-matcha-lg p-6 sm:p-8"
				style={{ animation: "modalIn 180ms cubic-bezier(0.22, 1, 0.36, 1)" }}
				onMouseDown={(e) => e.stopPropagation()}
			>
				<button
					ref={closeButtonRef}
					type="button"
					onClick={onClose}
					className="group absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl text-subink transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream-200/60 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
					aria-label="Close resume dialog"
				>
					<svg
						className="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<div className="text-center">
					<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-line/60 bg-cream-100/70 shadow-matcha-sm">
						<svg
							className="h-7 w-7 text-matcha-700"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>

					<h3
						id={titleId}
						className="text-2xl sm:text-3xl font-semibold tracking-tight text-matcha"
					>
						My Resume
					</h3>
					<p
						id={descriptionId}
						className="mt-2 text-sm text-subink leading-relaxed font-light"
					>
						View my qualifications, experience, and skills.
					</p>

					<div className="mt-7 space-y-3">
						<a
							href="/resume.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-matcha px-5 py-3 text-sm font-medium text-cream-50 shadow-matcha-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-matcha-dark hover:shadow-matcha-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
						>
							<svg
								className="h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
							View Resume
						</a>

						<a
							href="/resume.pdf"
							download="Ryan_Nguyen_Resume.pdf"
							className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-line/70 bg-card/60 px-5 py-3 text-sm font-medium text-ink shadow-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-card/80 hover:shadow-matcha-sm active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha/30 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
						>
							<svg
								className="h-5 w-5 text-matcha-700"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							Download PDF
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};
