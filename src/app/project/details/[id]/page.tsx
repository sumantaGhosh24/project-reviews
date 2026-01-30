import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchViewProject} from "@/features/projects/server/prefetch";
import {prefetchReleases} from "@/features/releases/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ProjectDetails from "@/features/projects/components/project-details";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

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
