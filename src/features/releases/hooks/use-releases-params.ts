import {useQueryStates} from "nuqs";

import {releasesParams} from "../params";

export const useReleasesParams = () => {
  return useQueryStates(releasesParams);
};
