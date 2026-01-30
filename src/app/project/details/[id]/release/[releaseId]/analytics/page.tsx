import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchReleaseDashboard} from "@/features/dashboard/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ReleaseAnalytics from "@/features/releases/components/release-analytics";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export const metadata = {
  title: "Release Analytics",
};

const ReleaseAnalyticsPage = async ({
  params,
}: PageProps<"/project/details/[id]/release/[releaseId]/analytics">) => {
  await requireAuth();

  const {releaseId} = await params;

  prefetchReleaseDashboard(releaseId);

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
          <ReleaseAnalytics releaseId={releaseId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ReleaseAnalyticsPage;
