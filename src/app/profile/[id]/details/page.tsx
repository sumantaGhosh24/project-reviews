import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchUser} from "@/features/profile/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ProfileDetails from "@/features/profile/components/profile-details";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export const metadata = {
  title: "Profile Details",
};

export default async function ProfilePage({
  params,
}: PageProps<"/profile/[id]/details">) {
  const {id} = await params;

  await requireAuth();

  prefetchUser(id);

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
          <ProfileDetails id={id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
