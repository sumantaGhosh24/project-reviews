import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireSubscription} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import CreateProjectForm from "@/features/projects/components/create-project-form";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

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
