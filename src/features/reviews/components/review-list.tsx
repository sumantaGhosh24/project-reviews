"use client";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import PaginationComponent from "@/features/global/components/pagination-component";
import EmptyComponent from "@/features/global/components/empty-component";

import {useSuspenseReviews} from "../hooks/use-reviews";
import {ReviewItem} from "./review-item";

interface ReviewListProps {
  releaseId: string;
}

export function ReviewList({releaseId}: ReviewListProps) {
  const {data: reviews, isFetching} = useSuspenseReviews(releaseId);

  const [params, setParams] = useGlobalParams();

  return (
    <>
      {reviews.items.length > 0 ? (
        <div className="mt-4">
          {reviews.items.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
          {reviews.totalPages > 1 && (
            <PaginationComponent
              page={reviews?.page}
              totalPages={reviews.totalPages}
              onPageChange={(page) => setParams({...params, page})}
              disabled={isFetching}
            />
          )}
        </div>
      ) : (
        <EmptyComponent
          title="No Review Found"
          description="Try again later"
          buttonText="Go Home"
          redirectUrl="/home"
        />
      )}
    </>
  );
}
