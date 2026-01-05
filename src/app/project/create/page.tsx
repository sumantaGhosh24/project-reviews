import CreateProjectForm from "@/features/projects/components/create-project-form";

export const metadata = {
  title: "Create Project",
};

const CreateProject = async () => {
  return (
    <>
      <CreateProjectForm />
    </>
  );
};

export default CreateProject;
