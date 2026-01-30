import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchRelease} from "@/features/releases/server/prefetch";
import {prefetchReviews} from "@/features/reviews/server/prefetch";
import {prefetchComments} from "@/features/comments/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ReleaseDetails from "@/features/releases/components/release-details";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export const metadata = {
  title: "Release Details",
};

const ReleaseDetailsPage = async ({
  params,
  searchParams,
}: PageProps<"/project/details/[id]/release/[releaseId]">) => {
  await requireAuth();

  const globalParams = await globalParamsLoader(searchParams);

  const {releaseId} = await params;

  prefetchRelease(releaseId);

  prefetchReviews({...globalParams, releaseId});

  prefetchComments({...globalParams, releaseId});

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
          <ReleaseDetails id={releaseId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ReleaseDetailsPage;
