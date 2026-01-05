"use client";

import {useRouter} from "next/navigation";
import {formatDistanceToNowStrict} from "date-fns";
import {EyeIcon, PenIcon} from "lucide-react";

import {
  EmptyComponent,
  PaginationComponent,
} from "@/components/entity-components";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

import {useProjectsParams} from "../hooks/use-projects-params";
import DeleteProject from "./delete-project";

const ProjectsTable = () => {
  const router = useRouter();

  const projects = {
    items: [
      {
        id: "1",
        title: "EcoTrack: AI Personal Carbon Footprint",
        category: "SaaS / AI",
        description:
          "A mobile app that uses computer vision to scan grocery receipts and calculate the carbon footprint of your shopping cart automatically.",
        author: "Sarah Drasner",
        reviews: 24,
        upvotes: 142,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        title: "DevQuest: Gamified Jira Alternative",
        category: "Projectivity",
        description:
          "Turning software tickets into RPG quests. Complete a pull request, gain EXP, and level up your dev avatar with team-wide leaderboards.",
        author: "Marcus Aurelius",
        reviews: 8,
        upvotes: 89,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        title: "OpenSauce: Local Restaurant API",
        category: "Open Source",
        description:
          "A unified API for independent restaurants that don't want to use UberEats. Completely open-source and community driven.",
        author: "Lee Robinson",
        reviews: 45,
        upvotes: 210,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    totalPages: 1,
    page: 1,
  };
  const isFetching = false;

  const [params, setParams] = useProjectsParams();

  return (
    <>
      {projects.items.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <Table>
            <TableCaption>A list of your projects.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Upvotes</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.items.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.id}</TableCell>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.author}</TableCell>
                  <TableCell>{project.reviews}</TableCell>
                  <TableCell>{project.upvotes}</TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(project.createdAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button
                      variant="success"
                      onClick={() =>
                        router.push(`/project/update/${project.id}`)
                      }
                    >
                      <PenIcon size={24} />
                      Update
                    </Button>
                    <Button
                      variant="default"
                      onClick={() =>
                        router.push(`/project/details/${project.id}`)
                      }
                    >
                      <EyeIcon size={24} />
                      View
                    </Button>
                    <DeleteProject id={project.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
          buttonText="Create Project"
          redirectUrl="/project/create"
        />
      )}
    </>
  );
};

export default ProjectsTable;
