import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchViewProject} from "@/features/projects/server/prefetch";
import {prefetchReleases} from "@/features/releases/server/prefetch";
import {prefetchProjectDashboard} from "@/features/dashboard/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ProjectDetails from "@/features/projects/components/project-details";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

export const metadata = {
  title: "Project Details",
};

const ProjectDetailsPage = async ({
  params,
}: PageProps<"/project/details/[id]">) => {
  await requireAuth();

  const {id} = await params;

  prefetchViewProject(id);

  prefetchReleases({projectId: id});

  prefetchProjectDashboard(id);

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
          <ProjectDetails id={id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ProjectDetailsPage;
