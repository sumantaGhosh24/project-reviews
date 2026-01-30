"use client";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import PaginationComponent from "@/features/global/components/pagination-component";
import EmptyComponent from "@/features/global/components/empty-component";

import {useSuspenseComments} from "../hooks/use-comments";
import {CommentItem} from "./comment-item";

interface CommentListProps {
  releaseId: string;
}

export function CommentList({releaseId}: CommentListProps) {
  const {data: comments, isFetching} = useSuspenseComments(releaseId);

  const [params, setParams] = useGlobalParams();

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
