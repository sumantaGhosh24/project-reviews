import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchRelease} from "@/features/releases/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ReleaseDetails from "@/features/releases/components/release-details";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

export const metadata = {
  title: "Release Details",
};

const ReleaseDetailsPage = async ({
  params,
}: PageProps<"/project/details/[id]/release/[releaseId]">) => {
  await requireAuth();

  const {releaseId} = await params;

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
          <ReleaseDetails id={releaseId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ReleaseDetailsPage;
