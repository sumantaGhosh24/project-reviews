"use client";

import {Trash2Icon, TrendingDownIcon, TrendingUpIcon} from "lucide-react";

import {useVote} from "@/features/votes/hooks/use-votes";
import {LoadingSwap} from "@/components/loading-swap";
import {Button} from "@/components/ui/button";

import {useRemoveReview} from "../hooks/use-reviews";

interface ReviewsActionsProps {
  reviewId: string;
  releaseId: string;
  isOwner: boolean;
  votes: {
    type: string;
    _count: number;
  }[];
  myVote: {
    type: string;
  } | null;
}

export function ReviewActions({
  reviewId,
  releaseId,
  isOwner,
  votes,
  myVote,
}: ReviewsActionsProps) {
  const upVote = votes.find((v) => v.type === "UP")?._count ?? 0;
  const downVote = votes.find((v) => v.type === "DOWN")?._count ?? 0;

  const voteReview = useVote(releaseId);

  const handleVote = async (type: "UP" | "DOWN") => {
    voteReview.mutate({
      target: "REVIEW",
      targetId: reviewId,
      type,
    });
  };

  const deleteReview = useRemoveReview();

  const handleDelete = () => {
    deleteReview.mutate({id: reviewId});
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Button
        onClick={() => handleVote("UP")}
        variant={myVote?.type === "UP" ? "success" : "ghost"}
        size="sm"
      >
        <TrendingUpIcon className="h-4 w-4 mr-2" /> Up Vote (+{upVote})
      </Button>
      <Button
        onClick={() => handleVote("DOWN")}
        variant={myVote?.type === "DOWN" ? "destructive" : "ghost"}
        size="sm"
      >
        <TrendingDownIcon className="h-4 w-4 mr-2" /> Down Vote (-{downVote})
      </Button>
      {isOwner && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={handleDelete}
          disabled={deleteReview.isPending}
        >
          <LoadingSwap isLoading={deleteReview.isPending}>
            <span className="flex items-center gap-2">
              <Trash2Icon className="mr-1 h-4 w-4" />
              Delete
            </span>
          </LoadingSwap>
        </Button>
      )}
    </div>
  );
}
