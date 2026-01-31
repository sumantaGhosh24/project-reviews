"use client";

import {
  MessageCircleIcon,
  Trash2Icon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

import {useVote} from "@/features/votes/hooks/use-votes";
import {LoadingSwap} from "@/components/loading-swap";
import {Button} from "@/components/ui/button";

import {useRemoveComment} from "../hooks/use-comments";

interface CommentsActionsProps {
  commentId: string;
  releaseId: string;
  isOwner: boolean;
  votes: {
    type: string;
    _count: number;
  }[];
  myVote: {
    type: string;
  } | null;
  onReply: () => void;
  replyCount: number;
}

export function CommentActions({
  commentId,
  releaseId,
  isOwner,
  votes,
  myVote,
  onReply,
  replyCount,
}: CommentsActionsProps) {
  const upVote = votes.find((v) => v.type === "UP")?._count ?? 0;
  const downVote = votes.find((v) => v.type === "DOWN")?._count ?? 0;

  const voteComment = useVote(releaseId);

  const handleVote = async (type: "UP" | "DOWN") => {
    voteComment.mutate({
      target: "COMMENT",
      targetId: commentId,
      type,
    });
  };

  const handleReply = () => {
    onReply();
  };

  const deleteComment = useRemoveComment();

  const handleDelete = () => {
    deleteComment.mutate({id: commentId});
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Button
        onClick={() => handleVote("UP")}
        variant={myVote?.type === "UP" ? "success" : "ghost"}
        size="sm"
      >
        <TrendingUpIcon className="h-4 w-4" /> Up Vote (+{upVote})
      </Button>
      <Button
        onClick={() => handleVote("DOWN")}
        variant={myVote?.type === "DOWN" ? "destructive" : "ghost"}
        size="sm"
      >
        <TrendingDownIcon className="h-4 w-4" /> Down Vote (-{downVote})
      </Button>
      <Button variant="ghost" size="sm" onClick={handleReply}>
        <MessageCircleIcon className="h-4 w-4" />
        Reply ({replyCount})
      </Button>
      {isOwner && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={handleDelete}
          disabled={deleteComment.isPending}
        >
          <LoadingSwap isLoading={deleteComment.isPending}>
            <span className="flex items-center gap-2">
              <Trash2Icon className="h-4 w-4" />
              Delete
            </span>
          </LoadingSwap>
        </Button>
      )}
    </div>
  );
}
