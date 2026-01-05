import {projectsParamsLoader} from "@/features/projects/server/params-loader";
import ManageProjects from "@/features/projects/components/manage-projects";

export const metadata = {
  title: "Manage All Projects",
};

// TODO:
const AllProjectsPage = async ({searchParams}: PageProps<"/project/all">) => {
  const params = await projectsParamsLoader(searchParams);

  return (
    <>
      <ManageProjects />
    </>
  );
};

export default AllProjectsPage;
