import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchFollowers} from "@/features/profile/server/prefetch";
import {profileParamsLoader} from "@/features/profile/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import ProfileFollowers from "@/features/profile/components/profile-followers";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

export default async function ProfileFollowersPage({
  params,
  searchParams,
}: PageProps<"/profile/[id]/details">) {
  const {id} = await params;

  await requireAuth();

  const profileParams = await profileParamsLoader(searchParams);

  prefetchFollowers({id, ...profileParams});

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
          <ProfileFollowers id={id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
