import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import {prefetchCategories} from "@/features/categories/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ManageCategories from "@/features/categories/components/manage-categories";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export const metadata = {
  title: "Manage Category",
};

const CategoriesPage = async ({searchParams}: PageProps<"/category">) => {
  await requireAdmin();

  const params = await globalParamsLoader(searchParams);

  prefetchCategories(params);

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
          <ManageCategories />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default CategoriesPage;
