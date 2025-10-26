import type { Project } from "@/.contentlayer/generated";
import Link from "next/link";
import { Eye, View } from "lucide-react";

type Props = {
	project: Project;
	views: number;
};

export const Article: React.FC<Props> = ({ project, views }) => {
	return (
		<Link href={`/projects/${project.slug}`}>
			<article className="p-4 md:p-8">
				<div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-300 text-subink group-hover:text-matcha font-light">
						{project.date ? (
							<time dateTime={new Date(project.date).toISOString()}>
								{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
									new Date(project.date),
								)}
							</time>
						) : (
							<span>SOON</span>
						)}
					</span>
					<span className="text-subink text-xs flex items-center gap-1">
						{/* <Eye className="w-4 h-4" />{" "}
						{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)} */}
					</span>
				</div>
				<h2 className="z-20 text-xl font-medium duration-300 lg:text-3xl text-matcha group-hover:text-matcha-light font-display">
					{project.title}
				</h2>
				<p className="z-20 mt-4 text-sm duration-300 text-subink group-hover:text-matcha-dark font-light leading-relaxed">
					{project.description}
				</p>
			</article>
		</Link>
	);
};
