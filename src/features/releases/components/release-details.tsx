"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {useTheme} from "next-themes";
import {formatDistanceToNowStrict} from "date-fns";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ChartBarIcon,
  ChessKingIcon,
  EyeIcon,
  LockIcon,
  MessageSquareIcon,
  StarIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ViewIcon,
} from "lucide-react";

import {checkStatus, checkVisibility} from "@/lib/utils";
import {authClient} from "@/lib/auth/auth-client";
import {useVote} from "@/features/votes/hooks/use-votes";
import {useHasActiveSubscription} from "@/features/subscriptions/hooks/useSubscription";
import ManageReviews from "@/features/reviews/components/manage-reviews";
import ManageComments from "@/features/comments/components/manage-comments";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Skeleton} from "@/components/ui/skeleton";

import {useSuspenseRelease} from "../hooks/use-releases";
import DeleteRelease from "./delete-release";
import ReleaseChat from "./release-chat";

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

  const {isLoading, hasActiveSubscription} = useHasActiveSubscription();

  const handleSubscribe = async () => {
    if (hasActiveSubscription) return;

    await authClient.checkout({
      products: ["e651f46d-ac20-4f26-b769-ad088b123df2"],
      slug: "pro",
    });
  };

  if (isLoading) {
    return <Skeleton className="w-full h-20" />;
  }

  return (
    <div className="container mx-auto my-5 rounded-md shadow-md p-5 bg-background dark:shadow-white/40 space-y-5">
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
              <EyeIcon className="h-4 w-4" />
            ) : (
              <LockIcon className="h-4 w-4" />
            )}
            {release.visibility}
          </Badge>
          <Badge variant="success">
            <TrendingUpIcon className="w-4 h-4" />
            {upVote}
          </Badge>
          <Badge variant="destructive">
            <TrendingDownIcon className="w-4 h-4" />
            {downVote}
          </Badge>
          <Badge variant="default">
            <ViewIcon className="w-4 h-4" />
            {release.views}
          </Badge>
          <Badge variant="warning">
            <StarIcon className="w-4 h-4" />
            {release.reviewStats._avg.rating?.toFixed(1)} (
            {release.reviewStats._count.id})
          </Badge>
          <Badge variant="warning">
            <MessageSquareIcon className="w-4 h-4" />
            {release._count.comments}
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Button asChild>
          <Link href={`/project/details/${release.projectId}`}>
            <ArrowLeftIcon className="h-4 w-4" /> Back to Project
          </Link>
        </Button>
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
          <TrendingUpIcon className="h-4 w-4" /> Up Vote
        </Button>
        <Button
          onClick={() => handleVote("DOWN")}
          variant={
            release.myVote?.type === "DOWN" ? "destructive" : "secondary"
          }
        >
          <TrendingDownIcon className="h-4 w-4" /> Down Vote
        </Button>
        {release.isOwner && (
          <>
            <Button variant="success" asChild>
              <Link
                href={`/project/details/${release.projectId}/release/${release.id}/update`}
              >
                Update Release
              </Link>
            </Button>
            <DeleteRelease id={release.id} />
            <Button asChild>
              <Link
                href={`/project/details/${release?.projectId}/release/${release.id}/analytics`}
              >
                <ChartBarIcon className="h-4 w-4" /> Analytics
              </Link>
            </Button>
          </>
        )}
        {hasActiveSubscription ? (
          <ReleaseChat content={release.content} />
        ) : (
          <Button type="button" onClick={handleSubscribe}>
            <span className="flex items-center gap-1.5">
              <ChessKingIcon className="h-4 w-4" /> Subscribe
            </span>
          </Button>
        )}
      </div>
      <div className="mx-10">
        <Carousel>
          <CarouselContent>
            {release.images.map((img) => (
              <CarouselItem key={img.id}>
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={img.url}
                    alt="Image"
                    className="w-full rounded-lg object-cover"
                    fill
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
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
      <div>
        <Tabs defaultValue="comments" className="w-full">
          <TabsList>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="comments">
            <ManageComments releaseId={release.id} />
          </TabsContent>
          <TabsContent value="reviews">
            <ManageReviews releaseId={release.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReleaseDetails;
