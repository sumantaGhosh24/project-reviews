import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchMyComments} from "@/features/comments/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ManageDashboardComments from "@/features/comments/components/manage-dashboard-comments";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

const DashboardCommentsPage = async ({
  searchParams,
}: PageProps<"/dashboard">) => {
  await requireAuth();

  const params = await globalParamsLoader(searchParams);

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
