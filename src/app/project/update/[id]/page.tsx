import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireSubscription} from "@/features/auth/helpers/auth-utils";
import {prefetchProject} from "@/features/projects/server/prefetch";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import UpdateProjectComponent from "@/features/projects/components/update-project-component";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

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
          <UpdateProjectComponent id={id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default UpdateProject;
