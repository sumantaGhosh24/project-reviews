import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchMyComments} from "@/features/comments/server/prefetch";
import {commentsParamsLoader} from "@/features/comments/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageDashboardComments from "@/features/comments/components/manage-dashboard-comments";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

const DashboardCommentsPage = async ({
  searchParams,
}: PageProps<"/dashboard">) => {
  await requireAuth();

  const params = await commentsParamsLoader(searchParams);

  prefetchMyComments(params);

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
          <ManageDashboardComments />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default DashboardCommentsPage;
