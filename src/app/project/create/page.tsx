import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireSubscription} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";
import CreateProjectForm from "@/features/projects/components/create-project-form";

export const metadata = {
  title: "Create Project",
};

const CreateProject = async () => {
  await requireSubscription();

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
          <CreateProjectForm />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default CreateProject;
