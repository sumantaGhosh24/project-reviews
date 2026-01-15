"use client";

import ProjectCard from "@/features/projects/components/project-card";
import {
  EmptyComponent,
  PaginationComponent,
} from "@/components/entity-components";

import {useSuspenseUserProjects} from "../hooks/use-projects";
import {useProjectsParams} from "../hooks/use-projects-params";
import SearchProject from "./search-project";
import FilterCategory from "./filter-category";

interface ProfileProjectsProps {
  id: string;
}

const ProfileProjects = ({id}: ProfileProjectsProps) => {
  const {data: projects, isFetching} = useSuspenseUserProjects(id);

  const [params, setParams] = useProjectsParams();

  return (
    <div className="space-y-3">
      <SearchProject />
      <FilterCategory />
      {projects.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.items.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
            {projects.totalPages > 1 && (
              <PaginationComponent
                page={projects?.page}
                totalPages={projects.totalPages}
                onPageChange={(page) => setParams({...params, page})}
                disabled={isFetching}
              />
            )}
          </div>
        </>
      ) : (
        <EmptyComponent
          title="No Project Found"
          description="Try again later"
          buttonText="Go Home"
          redirectUrl="/home"
        />
      )}
    </div>
  );
};

export default ProfileProjects;
