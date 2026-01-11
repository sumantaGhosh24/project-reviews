import {Suspense} from "react";
import {ErrorBoundary} from "@sentry/nextjs";

import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import {categoriesParamsLoader} from "@/features/categories/server/params-loader";
import {prefetchCategories} from "@/features/categories/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import ManageCategories from "@/features/categories/components/manage-categories";
import {ErrorComponent, LoadingComponent} from "@/components/entity-components";

export const metadata = {
  title: "Manage Category",
};

const CategoriesPage = async ({searchParams}: PageProps<"/category">) => {
  await requireAdmin();

  const params = await categoriesParamsLoader(searchParams);

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
