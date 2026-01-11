import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchFollowings} from "@/features/profile/server/prefetch";
import {profileParamsLoader} from "@/features/profile/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ProfileFollowings from "@/features/profile/components/profile-followings";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

export default async function ProfileFollowingsPage({
  params,
  searchParams,
}: PageProps<"/profile/[id]/details">) {
  const {id} = await params;

  await requireAuth();

  const profileParams = await profileParamsLoader(searchParams);

  prefetchFollowings({id, ...profileParams});

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
          <ProfileFollowings id={id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
