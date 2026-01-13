import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import {notificationsParamsLoader} from "@/features/notifications/server/params-loader";
import {prefetchNotifications} from "@/features/notifications/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ManageNotifications from "@/features/notifications/components/manage-notifications";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

export const metadata = {
  title: "Manage Notifications",
};

const NotificationsPage = async ({
  searchParams,
}: PageProps<"/notifications">) => {
  await requireAdmin();

  const params = await notificationsParamsLoader(searchParams);

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
