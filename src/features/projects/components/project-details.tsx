"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import dynamic from "next/dynamic";
import {useTheme} from "next-themes";
import Link from "next/link";
import {formatDistanceToNowStrict} from "date-fns";
import {
  CalendarIcon,
  EyeIcon,
  GithubIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  LockIcon,
  PencilIcon,
  TagIcon,
} from "lucide-react";

import {checkStatus, checkVisibility} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";

import {useSuspenseViewProject} from "../hooks/use-projects";

interface ProjectDetailsProps {
  id: string;
}

const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  {ssr: false}
);

const ProjectDetails = ({id}: ProjectDetailsProps) => {
  const {data: project} = useSuspenseViewProject(id);

  const {theme} = useTheme();

  return (
    <div className="mx-auto my-5 w-[95%] rounded-md shadow-md p-5 bg-background dark:shadow-white/40">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold capitalize">{project.title}</h2>
            <p className="text-muted-foreground mt-2 capitalize">
              {project.description}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant={checkStatus(project.status)}>
              {project.status}
            </Badge>
            <Badge variant={checkVisibility(project.visibility)}>
              {project.visibility === "PUBLIC" ? (
                <EyeIcon className="h-3 w-3 mr-1" />
              ) : (
                <LockIcon className="h-3 w-3 mr-1" />
              )}
              {project.visibility}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div>
            <Link
              href={`/profile/${project.owner.id}/details`}
              className="flex items-center gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    project.owner.image ?? "https://placehold.co/600x400.png"
                  }
                />
                <AvatarFallback>
                  {project.owner.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium capitalize">
                {project.owner.name}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>
              Published{" "}
              {project?.publishedAt ? (
                formatDistanceToNowStrict(project?.publishedAt, {
                  addSuffix: true,
                })
              ) : (
                <Badge variant="destructive" className="uppercase">
                  not published
                </Badge>
              )}
            </span>
          </div>
          <Badge className="uppercase">{project.category.name}</Badge>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {project.tags.map((tag) => (
              <Badge key={tag} className="uppercase">
                <TagIcon className="mr-1" /> {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-4">
          <Button asChild>
            <Link href={project.websiteUrl} target="_blank">
              <GlobeIcon className="h-4 w-4 mr-2" /> Visit Website
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={project.githubUrl} target="_blank">
              <GithubIcon className="h-4 w-4 mr-2" /> Visit GitHub
            </Link>
          </Button>
          {project.isOwner && (
            <>
              <Button variant="success" asChild>
                <Link href={`/project/update/${project.id}`}>
                  <PencilIcon className="h-4 w-4 mr-2" /> Update
                </Link>
              </Button>
              <Button>
                <LayoutDashboardIcon className="h-4 w-4 mr-2" /> View Analytics
              </Button>
            </>
          )}
        </div>
        <div>
          <div data-color-mode={theme}>
            <EditerMarkdown
              source={project.content}
              style={{whiteSpace: "pre-wrap"}}
              className="mb-5 border p-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
