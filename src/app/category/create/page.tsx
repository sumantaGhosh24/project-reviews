import CreateCategoryForm from "@/features/categories/components/create-category-form";

export const metadata = {
  title: "Create Category",
};

const CreateCategory = async () => {
  return (
    <div className="container mx-auto space-y-4 rounded-md shadow-md p-5 bg-background dark:shadow-white/40 my-20">
      <CreateCategoryForm />
    </div>
  );
};

export default CreateCategory;
