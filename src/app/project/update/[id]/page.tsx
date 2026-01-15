import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireSubscription} from "@/features/auth/helpers/auth-utils";
import {prefetchProject} from "@/features/projects/server/prefetch";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";
import UpdateProjectForm from "@/features/projects/components/update-project-form";

export const metadata = {
  title: "Update Project",
};

const UpdateProject = async ({params}: PageProps<"/project/update/[id]">) => {
  await requireSubscription();

  const {id} = await params;

  prefetchProject(id);

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
          <UpdateProjectForm id={id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default UpdateProject;
