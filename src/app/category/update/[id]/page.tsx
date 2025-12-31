import UpdateCategoryForm from "@/features/categories/components/update-category-form";

export const metadata = {
  title: "Update Category",
};

// TODO:
const UpdateCategory = async ({params}: PageProps<"/category/update/[id]">) => {
  const {id} = await params;

  return (
    <>
      <UpdateCategoryForm id={id} />
    </>
  );
};

export default UpdateCategory;
