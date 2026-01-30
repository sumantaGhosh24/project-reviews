import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {prefetchMyProjects} from "@/features/projects/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageDashboardProjects from "@/features/projects/components/manage-dashboard-projects";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

const DashboardProjectsPage = async ({
  searchParams,
}: PageProps<"/dashboard">) => {
  await requireAuth();

  const params = await globalParamsLoader(searchParams);

  prefetchMyProjects(params);

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
          <ManageDashboardProjects />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default DashboardProjectsPage;
