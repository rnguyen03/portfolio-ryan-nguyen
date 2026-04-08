import type { Project } from "@/.contentlayer/generated";
import Link from "next/link";
import { Coffee, Coins } from "lucide-react";

type Props = {
	project: Project;
	views: number;
	variant?: "default" | "featured";
};

export const Article: React.FC<Props> = ({ project, views, variant = "default" }) => {
	const date = project.date ? new Date(project.date) : null;
	const brewDateLabel = date
		? Intl.DateTimeFormat(undefined, {
			month: "long",
			day: "numeric",
			year: "numeric",
		}).format(date)
		: null;
	const monthValue = date ? date.getMonth() + 1 : null;
	const yearValue = date ? date.getFullYear() % 100 : null;
	const priceLabel =
		monthValue !== null && yearValue !== null
			? `$${monthValue}.${yearValue.toString().padStart(2, "0")} CAD`
			: "Pricing soon";

	return (
		<Link
			href={`/projects/${project.slug}`}
			className="group block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-matcha/50"
		>
			<article
				className={`flex flex-col overflow-hidden ${
					variant === "featured" ? "gap-6 p-8 md:p-10" : "gap-4 p-6 md:p-8"
				}`}
			>
				<div className="flex flex-nowrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-subink/80 min-w-0">
					<div className="flex items-center gap-2 flex-shrink-0">
						<Coffee className="w-3.5 h-3.5 text-matcha flex-shrink-0" aria-hidden />
						{brewDateLabel && date ? (
							<time dateTime={date.toISOString()} className="font-medium text-matcha group-hover:text-matcha-light whitespace-nowrap">
								{brewDateLabel}
							</time>
						) : (
							<span className="font-medium text-matcha whitespace-nowrap">Soon</span>
						)}
					</div>
					<span className="flex-1 min-w-[24px] h-px bg-subink/40" aria-hidden />
					<div className="flex items-center gap-2 flex-shrink-0">
						<Coins className="w-3.5 h-3.5 text-clay flex-shrink-0" aria-hidden />
						<span className="font-semibold text-matcha-dark tracking-normal transition-colors group-hover:text-matcha-light whitespace-nowrap">
							{priceLabel}
						</span>
					</div>
					<span className="flex-1 min-w-[24px] h-px bg-subink/40 hidden sm:block" aria-hidden />
				</div>
				<h2
					className={`${
						variant === "featured"
							? "mt-2 text-3xl md:text-4xl"
							: "mt-4 text-2xl md:text-3xl"
					} font-semibold text-matcha group-hover:text-matcha-light font-display break-words`}
				>
					{project.title}
				</h2>
				<p
					className={`${
						variant === "featured"
							? "text-base md:text-lg"
							: "text-base"
					} text-subink/90 group-hover:text-matcha-dark leading-relaxed break-words`}
				>
					{project.description}
				</p>
			</article>
		</Link>
	);
};
