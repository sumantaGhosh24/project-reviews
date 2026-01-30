"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import {useSuspenseProject} from "../hooks/use-projects";
import UpdateProjectForm from "./update-project-form";
import AddProjectImage from "./add-project-image";
import RemoveProjectImage from "./remove-project-image";

interface UpdateProjectComponentProps {
  id: string;
}

const UpdateProjectComponent = ({id}: UpdateProjectComponentProps) => {
  const {data: project} = useSuspenseProject(id);

  return (
    <div className="container mx-auto space-y-4 rounded-md shadow-md p-5 bg-background dark:shadow-white/40 my-20">
      <Tabs defaultValue="update-project" className="w-full">
        <TabsList className="grid grid-cols-3 mb-5">
          <TabsTrigger value="update-project">Update Project</TabsTrigger>
          <TabsTrigger value="add-image">Add Project Image</TabsTrigger>
          <TabsTrigger value="remove-image">Remove Project Image</TabsTrigger>
        </TabsList>
        <TabsContent value="update-project">
          <UpdateProjectForm project={project} />
        </TabsContent>
        <TabsContent value="add-image">
          <AddProjectImage project={project} />
        </TabsContent>
        <TabsContent value="remove-image">
          <RemoveProjectImage id={project.id} images={project.images} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpdateProjectComponent;
