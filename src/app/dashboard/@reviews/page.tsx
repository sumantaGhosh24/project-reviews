import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchMyReviews} from "@/features/reviews/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageDashboardReviews from "@/features/reviews/components/manage-dashboard-reviews";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

const DashboardReviewsPage = async ({
  searchParams,
}: PageProps<"/dashboard">) => {
  await requireAuth();

  const params = await globalParamsLoader(searchParams);

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
