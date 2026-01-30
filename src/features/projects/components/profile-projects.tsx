"use client";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import ProjectCard from "@/features/projects/components/project-card";
import SearchBarComponent from "@/features/global/components/search-bar-component";
import FilterComponent from "@/features/global/components/filter-component";
import PaginationComponent from "@/features/global/components/pagination-component";
import EmptyComponent from "@/features/global/components/empty-component";

import {useSuspenseUserProjects} from "../hooks/use-projects";

interface ProfileProjectsProps {
  id: string;
}

const ProfileProjects = ({id}: ProfileProjectsProps) => {
  const {data: projects, isFetching} = useSuspenseUserProjects(id);

  const [params, setParams] = useGlobalParams();

  return (
    <div className="space-y-3">
      <SearchBarComponent placeholder="Search projects" />
      <FilterComponent />
      {projects.items.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.items.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
          {projects.totalPages > 1 && (
            <PaginationComponent
              page={projects?.page}
              totalPages={projects.totalPages}
              onPageChange={(page) => setParams({...params, page})}
              disabled={isFetching}
            />
          )}
        </div>
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
