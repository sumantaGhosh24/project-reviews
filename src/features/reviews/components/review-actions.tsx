"use client";

import {Trash2Icon} from "lucide-react";

import {Button} from "@/components/ui/button";
import {LoadingSwap} from "@/components/loading-swap";

import {useRemoveReview} from "../hooks/use-reviews";

interface ReviewsActionsProps {
  reviewId: string;
}

export function ReviewActions({reviewId}: ReviewsActionsProps) {
  const deleteReview = useRemoveReview();

  const handleDelete = () => {
    deleteReview.mutate({id: reviewId});
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
    </div>
  );
}
