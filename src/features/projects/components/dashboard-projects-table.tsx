"use client";

import {useRouter} from "next/navigation";
import Link from "next/link";
import {formatDistanceToNowStrict} from "date-fns";
import {
  ExternalLinkIcon,
  EyeIcon,
  PenIcon,
  StarIcon,
  TimerResetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ViewIcon,
} from "lucide-react";

import {checkStatus, checkVisibility} from "@/lib/utils";
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
import {Badge} from "@/components/ui/badge";

import {useSuspenseMyProjects} from "../hooks/use-projects";
import {useProjectsParams} from "../hooks/use-projects-params";
import DeleteProject from "./delete-project";

const DashboardProjectsTable = () => {
  const router = useRouter();

  const {data: projects, isFetching} = useSuspenseMyProjects();

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
                <TableHead>Up Votes</TableHead>
                <TableHead>Down Votes</TableHead>
                <TableHead>Unique Views</TableHead>
                <TableHead>Releases</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Github URL</TableHead>
                <TableHead>Website URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Published At</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.items.map((project) => {
                const upVote =
                  project.votes.find((v) => v.type === "UP")?._count ?? 0;
                const downVote =
                  project.votes.find((v) => v.type === "DOWN")?._count ?? 0;

                return (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.id}</TableCell>
                    <TableCell>
                      {project.title.length > 50
                        ? project.title.substring(0, 50) + "..."
                        : project.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-green-500">
                        <TrendingUpIcon size={24} />
                        {upVote}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-red-500">
                        <TrendingDownIcon size={24} />
                        {downVote}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-primary">
                        <ViewIcon size={24} />
                        {project.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-orange-500">
                        <TimerResetIcon size={24} />
                        {project._count.releases}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-orange-500">
                        <StarIcon size={24} />
                        {project.reviewStats._avg.rating}(
                        {project.reviewStats._count.id})
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="uppercase">
                        {project.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-2 flex-wrap">
                      {project.tags.map((tag, ind) => (
                        <Badge key={`${tag}-${ind}`} className="uppercase">
                          {tag}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Button asChild>
                        <Link href={project.githubUrl} target="_blank">
                          <ExternalLinkIcon size={24} /> Visit
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button asChild>
                        <Link href={project.websiteUrl} target="_blank">
                          <ExternalLinkIcon size={24} /> Visit
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={checkStatus(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={checkVisibility(project.visibility)}>
                        {project.visibility}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project?.publishedAt ? (
                        formatDistanceToNowStrict(project?.publishedAt, {
                          addSuffix: true,
                        })
                      ) : (
                        <Badge variant="destructive" className="uppercase">
                          Not Published
                        </Badge>
                      )}
                    </TableCell>
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
                    <TableCell className="">
                      <Button
                        variant="default"
                        onClick={() =>
                          router.push(`/project/details/${project.id}`)
                        }
                      >
                        <EyeIcon size={24} />
                        View
                      </Button>
                      <Button
                        variant="success"
                        onClick={() =>
                          router.push(`/project/update/${project.id}`)
                        }
                        className="mx-2"
                      >
                        <PenIcon size={24} />
                        Update
                      </Button>
                      <DeleteProject id={project.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
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

export default DashboardProjectsTable;
