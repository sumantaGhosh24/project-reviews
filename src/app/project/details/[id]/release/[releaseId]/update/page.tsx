import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireSubscription} from "@/features/auth/helpers/auth-utils";
import {prefetchRelease} from "@/features/releases/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import UpdateReleaseComponent from "@/features/releases/components/update-release-component";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export const metadata = {
  title: "Update Release",
};

const UpdateRelease = async ({
  params,
}: PageProps<"/project/details/[id]/release/[releaseId]/update">) => {
  await requireSubscription();

  const {id, releaseId} = await params;

  prefetchRelease(releaseId);

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
          <UpdateReleaseComponent id={id} releaseId={releaseId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default UpdateRelease;
