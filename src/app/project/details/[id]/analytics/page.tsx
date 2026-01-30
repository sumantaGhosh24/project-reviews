import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchProjectDashboard} from "@/features/dashboard/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ProjectAnalytics from "@/features/projects/components/project-analytics";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export const metadata = {
  title: "Project Analytics",
};

const ProjectAnalyticsPage = async ({
  params,
}: PageProps<"/project/details/[id]/analytics">) => {
  await requireAuth();

  const {id} = await params;

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
          <ProjectAnalytics projectId={id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ProjectAnalyticsPage;
