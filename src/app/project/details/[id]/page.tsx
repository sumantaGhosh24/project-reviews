export const metadata = {
  title: "Project Details",
};

const ProjectDetailsPage = async ({
  params,
}: PageProps<"/project/details/[id]">) => {
  const {id} = await params;

  return (
    <div>
      <h1>Project Details</h1>
    </div>
  );
};

export default ProjectDetailsPage;
