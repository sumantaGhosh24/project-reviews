"use client";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import ProjectCard from "@/features/projects/components/project-card";
import PaginationComponent from "@/features/global/components/pagination-component";
import EmptyComponent from "@/features/global/components/empty-component";

import {useSuspensePublicProjects} from "../hooks/use-projects";

const HomeProjects = () => {
  const {data: projects, isFetching} = useSuspensePublicProjects();

  const [params, setParams] = useGlobalParams();

  return (
    <div className="container mx-auto">
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

export default HomeProjects;
