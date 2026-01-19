"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import dynamic from "next/dynamic";
import {useTheme} from "next-themes";
import {formatDistanceToNowStrict} from "date-fns";
import {
  CalendarIcon,
  EyeIcon,
  LayoutDashboardIcon,
  LockIcon,
  MessageSquareIcon,
  StarIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ViewIcon,
} from "lucide-react";

import {checkStatus, checkVisibility} from "@/lib/utils";
import {useVote} from "@/features/votes/hooks/use-votes";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

import {useSuspenseRelease} from "../hooks/use-releases";
import UpdateReleaseForm from "./update-release-form";
import DeleteRelease from "./delete-release";

const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  {ssr: false}
);

interface ReleaseDetailsProps {
  id: string;
}

const ReleaseDetails = ({id}: ReleaseDetailsProps) => {
  const {data: release} = useSuspenseRelease(id);

  const {theme} = useTheme();

  const upVote = release.votes.find((v) => v.type === "UP")?._count ?? 0;
  const downVote = release.votes.find((v) => v.type === "DOWN")?._count ?? 0;

  const voteRelease = useVote();

  const handleVote = async (type: "UP" | "DOWN") => {
    voteRelease.mutate({
      target: "RELEASE",
      targetId: id,
      type,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold capitalize">{release.title}</h2>
          <p className="text-muted-foreground mt-2 capitalize">
            {release.description}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant={checkStatus(release.status)}>{release.status}</Badge>
          <Badge variant={checkVisibility(release.visibility)}>
            {release.visibility === "PUBLIC" ? (
              <EyeIcon className="h-4 w-4 mr-1" />
            ) : (
              <LockIcon className="h-4 w-4 mr-1" />
            )}
            {release.visibility}
          </Badge>
          <Badge variant="success">
            <TrendingUpIcon className="w-4 h-4 mr-1" />
            {upVote}
          </Badge>
          <Badge variant="destructive">
            <TrendingDownIcon className="w-4 h-4 mr-1" />
            {downVote}
          </Badge>
          <Badge variant="default">
            <ViewIcon className="w-4 h-4 mr-1" />
            {release.views}
          </Badge>
          <Badge variant="warning">
            <StarIcon className="w-4 h-4 mr-1" />
            {release._count.reviews}
          </Badge>
          <Badge variant="warning">
            <MessageSquareIcon className="w-4 h-4 mr-1" />
            {release._count.comments}
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          <span>
            Published{" "}
            {release?.publishedAt ? (
              formatDistanceToNowStrict(release?.publishedAt, {
                addSuffix: true,
              })
            ) : (
              <Badge variant="destructive" className="uppercase">
                not published
              </Badge>
            )}
          </span>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-4">
        <Button
          onClick={() => handleVote("UP")}
          variant={release.myVote?.type === "UP" ? "success" : "secondary"}
        >
          <TrendingUpIcon className="h-4 w-4 mr-2" /> Up Vote
        </Button>
        <Button
          onClick={() => handleVote("DOWN")}
          variant={
            release.myVote?.type === "DOWN" ? "destructive" : "secondary"
          }
        >
          <TrendingDownIcon className="h-4 w-4 mr-2" /> Down Vote
        </Button>
        {release.isOwner && (
          <>
            <UpdateReleaseForm id={release.id} />
            <DeleteRelease id={release.id} />
            <Button>
              <LayoutDashboardIcon className="h-4 w-4 mr-2" /> View Analytics
            </Button>
          </>
        )}
      </div>
      <div>
        <div data-color-mode={theme}>
          <EditerMarkdown
            source={release.content}
            style={{whiteSpace: "pre-wrap"}}
            className="mb-5 border p-5"
          />
        </div>
      </div>
    </>
  );
};

export default ReleaseDetails;
