import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {prefetchAllProjects} from "@/features/projects/server/prefetch";
import {projectsParamsLoader} from "@/features/projects/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageProjects from "@/features/projects/components/manage-projects";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

export const metadata = {
  title: "Manage Projects",
};

const ProjectsPage = async ({searchParams}: PageProps<"/project">) => {
  await requireAdmin();

  const params = await projectsParamsLoader(searchParams);

  prefetchAllProjects(params);

  prefetchAllCategory();

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <ErrorComponent
            title="Something went wrong"
            description="Try again later"
            buttonText="Go Home"
            redirectUrl="/"
          />
        }
      >
        <Suspense fallback={<LoadingComponent />}>
          <ManageProjects />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ProjectsPage;
