import UpdateProjectForm from "@/features/projects/components/update-project-form";

export const metadata = {
  title: "Update Project",
};

const UpdateProject = async ({params}: PageProps<"/project/update/[id]">) => {
  const {id} = await params;

  return (
    <>
      <UpdateProjectForm id={id} />
    </>
  );
};

export default UpdateProject;
