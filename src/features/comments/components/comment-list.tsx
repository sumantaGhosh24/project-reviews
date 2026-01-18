"use client";

import {
  EmptyComponent,
  PaginationComponent,
} from "@/components/entity-components";

import {useSuspenseComments} from "../hooks/use-comments";
import {useCommentsParams} from "../hooks/use-comments-params";
import {CommentItem} from "./comment-item";

interface CommentListProps {
  releaseId: string;
}

export function CommentList({releaseId}: CommentListProps) {
  const {data: comments, isFetching} = useSuspenseComments(releaseId);

  const [params, setParams] = useCommentsParams();

  return (
    <>
      {comments.items.length > 0 ? (
        <div className="mt-4">
          {comments.items.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          {comments.totalPages > 1 && (
            <PaginationComponent
              page={comments?.page}
              totalPages={comments.totalPages}
              onPageChange={(page) => setParams({...params, page})}
              disabled={isFetching}
            />
          )}
        </div>
      ) : (
        <EmptyComponent
          title="No Comment Found"
          description="Try again later"
          buttonText="Go Home"
          redirectUrl="/home"
        />
      )}
    </>
  );
}
