import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {prefetchAllProjects} from "@/features/projects/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageProjects from "@/features/projects/components/manage-projects";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export const metadata = {
  title: "Manage Projects",
};

const ProjectsPage = async ({searchParams}: PageProps<"/project">) => {
  await requireAdmin();

  const params = await globalParamsLoader(searchParams);

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
