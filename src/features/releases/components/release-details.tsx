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
} from "lucide-react";

import {checkStatus, checkVisibility} from "@/lib/utils";
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

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold capitalize">{release.title}</h2>
          <p className="text-muted-foreground mt-2 capitalize">
            {release.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={checkStatus(release.status)}>{release.status}</Badge>
          <Badge variant={checkVisibility(release.visibility)}>
            {release.visibility === "PUBLIC" ? (
              <EyeIcon className="h-3 w-3 mr-1" />
            ) : (
              <LockIcon className="h-3 w-3 mr-1" />
            )}
            {release.visibility}
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
