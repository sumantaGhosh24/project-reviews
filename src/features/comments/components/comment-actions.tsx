"use client";

import {HeartIcon, MessageCircleIcon, Trash2Icon} from "lucide-react";

import {Button} from "@/components/ui/button";
import {LoadingSwap} from "@/components/loading-swap";

import {useRemoveComment} from "../hooks/use-comments";

interface CommentsActionsProps {
  commentId: string;
  isOwner: boolean;
  onReply: () => void;
  replyCount: number;
}

export function CommentActions({
  commentId,
  isOwner,
  onReply,
  replyCount,
}: CommentsActionsProps) {
  const handleLike = () => {
    console.log("Like comment", commentId);
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
      <Button variant="ghost" size="sm" onClick={handleLike}>
        <HeartIcon className="mr-1 h-4 w-4" />
        Like
      </Button>
      <Button variant="ghost" size="sm" onClick={handleReply}>
        <MessageCircleIcon className="mr-1 h-4 w-4" />
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
              <Trash2Icon className="mr-1 h-4 w-4" />
              Delete
            </span>
          </LoadingSwap>
        </Button>
      )}
    </div>
  );
}
