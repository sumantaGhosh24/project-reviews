import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import {prefetchCategory} from "@/features/categories/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import UpdateCategoryForm from "@/features/categories/components/update-category-form";
import ErrorComponent from "@/features/global/components/error-component";
import LoadingComponent from "@/features/global/components/loading-component";

export const metadata = {
  title: "Update Category",
};

const UpdateCategory = async ({params}: PageProps<"/category/update/[id]">) => {
  await requireAdmin();

  const {id} = await params;

  prefetchCategory(id);

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
          <UpdateCategoryForm id={id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default UpdateCategory;
