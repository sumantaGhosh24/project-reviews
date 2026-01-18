import {useQueryStates} from "nuqs";

import {reviewsParams} from "../params";

export const useReviewsParams = () => {
  return useQueryStates(reviewsParams);
};
