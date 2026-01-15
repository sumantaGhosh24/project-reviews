import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {prefetchPublicProjects} from "@/features/projects/server/prefetch";
import {projectsParamsLoader} from "@/features/projects/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageHomeProjects from "@/features/projects/components/manage-home-projects";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

export const metadata = {
  title: "Home",
};

const Home = async ({searchParams}: PageProps<"/home">) => {
  await requireAuth();

  const params = await projectsParamsLoader(searchParams);

  prefetchPublicProjects(params);

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
          <ManageHomeProjects />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Home;
