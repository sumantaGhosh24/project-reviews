import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {prefetchRelease} from "@/features/releases/server/prefetch";
import {prefetchComments} from "@/features/comments/server/prefetch";
import {commentsParamsLoader} from "@/features/comments/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageComments from "@/features/comments/components/manage-comments";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

const ReleaseCommentsPage = async ({
  params,
  searchParams,
}: PageProps<"/project/details/[id]/release/[releaseId]">) => {
  const {releaseId} = await params;

  const commentParams = await commentsParamsLoader(searchParams);

  prefetchRelease(releaseId);

  prefetchComments({...commentParams, releaseId});

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
          <ManageComments releaseId={releaseId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ReleaseCommentsPage;
