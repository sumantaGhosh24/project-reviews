import {categoriesParamsLoader} from "@/features/categories/server/params-loader";
import ManageCategories from "@/features/categories/components/manage-categories";

export const metadata = {
  title: "Manage Category",
};

// TODO:
const CategoriesPage = async ({searchParams}: PageProps<"/category">) => {
  const params = await categoriesParamsLoader(searchParams);

  return (
    <>
      <ManageCategories />
    </>
  );
};

export default CategoriesPage;
