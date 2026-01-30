import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import {prefetchNotifications} from "@/features/notifications/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ManageNotifications from "@/features/notifications/components/manage-notifications";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export const metadata = {
  title: "Manage Notifications",
};

const NotificationsPage = async ({
  searchParams,
}: PageProps<"/notifications">) => {
  await requireAuth();

  const params = await globalParamsLoader(searchParams);

  prefetchNotifications(params);

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
          <ManageNotifications />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default NotificationsPage;
