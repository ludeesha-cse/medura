import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CtaBanner } from "@/components/sections/HomeSections";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectsExplorer } from "@/components/sections/ProjectsExplorer";
import { Section } from "@/components/ui/Section";
import {
  getHome,
  getProjectCategories,
  getProjects,
  getProjectsPage,
  projectImages,
} from "@/lib/content";

const page = getProjectsPage();

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: page.intro.subheading,
  path: "/projects/",
});

export default function ProjectsPage() {
  const projects = getProjects().map((p) => ({ ...p, displayImages: projectImages(p) }));
  return (
    <>
      <PageHeader intro={page.intro} image={projects[0]?.displayImages[0]} />
      {projects.length > 0 ? (
        <Section>
          <ProjectsExplorer
            projects={projects}
            categories={getProjectCategories()}
            allLabel={page.allLabel}
          />
        </Section>
      ) : (
        <Section>
          <p className="text-center text-muted-foreground">Projects coming soon.</p>
        </Section>
      )}
      <CtaBanner data={getHome().ctaBanner} />
    </>
  );
}
