import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchMyReviews} from "@/features/reviews/server/prefetch";
import {reviewsParamsLoader} from "@/features/reviews/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageDashboardReviews from "@/features/reviews/components/manage-dashboard-reviews";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

const DashboardReviewsPage = async ({
  searchParams,
}: PageProps<"/dashboard">) => {
  await requireAuth();

  const params = await reviewsParamsLoader(searchParams);

  prefetchMyReviews(params);

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
          <ManageDashboardReviews />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default DashboardReviewsPage;
