import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {
  prefetchAdminDashboard,
  prefetchDashboard,
} from "@/features/dashboard/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ManageDashboard from "@/features/dashboard/components/manage-dashboard";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export const metadata = {
  title: "Dashboard",
};

const Dashboard = async () => {
  await requireAuth();

  prefetchDashboard();

  prefetchAdminDashboard();

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
          <ManageDashboard />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Dashboard;
