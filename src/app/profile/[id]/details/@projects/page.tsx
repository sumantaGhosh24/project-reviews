import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {prefetchUserProjects} from "@/features/projects/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ProfileProjects from "@/features/projects/components/profile-projects";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export default async function ProfileProjectsPage({
  params,
  searchParams,
}: PageProps<"/profile/[id]/details">) {
  const {id} = await params;

  await requireAuth();

  const projectParams = await globalParamsLoader(searchParams);

  prefetchUserProjects({userId: id, ...projectParams});

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
          <ProfileProjects id={id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
