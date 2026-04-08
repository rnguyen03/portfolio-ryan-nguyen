import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  // Default views to 0 as Redis functionality is removed
  const views = 0;

  return (
    <div className="min-h-screen relative bg-paper">
      {/* Keep the same ambient café layers as the home page */}
      <div className="fixed inset-0 bg-sunlight pointer-events-none z-[1]"></div>
      <div className="fixed inset-0 bg-matcha-corner pointer-events-none z-[1]"></div>
      <div className="fixed inset-0 bg-paper-grain pointer-events-none z-[1]"></div>

      <Header project={project} views={views} />
      <ReportView slug={project.slug} />

      <article className="relative z-10 px-4 pb-20 pt-10 sm:pt-12">
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-line/50 bg-paper/85 shadow-matcha-sm backdrop-blur-sm p-6 sm:p-10">
          <Mdx code={project.body.code} />
        </div>
      </article>
    </div>
  );
}
