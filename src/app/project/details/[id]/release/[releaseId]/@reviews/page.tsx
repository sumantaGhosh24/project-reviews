import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {prefetchRelease} from "@/features/releases/server/prefetch";
import {prefetchReviews} from "@/features/reviews/server/prefetch";
import {reviewsParamsLoader} from "@/features/reviews/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageReviews from "@/features/reviews/components/manage-reviews";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

const ReleaseReviewsPage = async ({
  params,
  searchParams,
}: PageProps<"/project/details/[id]/release/[releaseId]">) => {
  const {releaseId} = await params;

  const reviewParams = await reviewsParamsLoader(searchParams);

  prefetchRelease(releaseId);

  prefetchReviews({...reviewParams, releaseId});

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
          <ManageReviews releaseId={releaseId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ReleaseReviewsPage;
