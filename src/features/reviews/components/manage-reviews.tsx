import {ReviewList} from "./review-list";
import {CreateReviewForm} from "./create-review-form";

interface ManageReviewsProps {
  releaseId: string;
}

const ManageReviews = ({releaseId}: ManageReviewsProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold">All Reviews</h2>
      <ReviewList releaseId={releaseId} />
      <CreateReviewForm releaseId={releaseId} />
    </div>
  );
};

export default ManageReviews;
