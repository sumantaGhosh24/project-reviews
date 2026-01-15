import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {prefetchMyProjects} from "@/features/projects/server/prefetch";
import {projectsParamsLoader} from "@/features/projects/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageDashboardProjects from "@/features/projects/components/manage-dashboard-projects";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

const DashboardPage = async ({searchParams}: PageProps<"/dashboard">) => {
  await requireAuth();

  const params = await projectsParamsLoader(searchParams);

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

export default DashboardPage;
