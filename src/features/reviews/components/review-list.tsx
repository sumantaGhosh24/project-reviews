"use client";

import {
  EmptyComponent,
  PaginationComponent,
} from "@/components/entity-components";

import {useSuspenseReviews} from "../hooks/use-reviews";
import {useReviewsParams} from "../hooks/use-reviews-params";
import {ReviewItem} from "./review-item";

interface ReviewListProps {
  releaseId: string;
}

export function ReviewList({releaseId}: ReviewListProps) {
  const {data: reviews, isFetching} = useSuspenseReviews(releaseId);

  const [params, setParams] = useReviewsParams();

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
