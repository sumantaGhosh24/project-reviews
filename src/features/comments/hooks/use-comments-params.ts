import {useQueryStates} from "nuqs";

import {commentsParams} from "../params";

export const useCommentsParams = () => {
  return useQueryStates(commentsParams);
};
