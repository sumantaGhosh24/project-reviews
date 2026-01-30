import {useQueryStates} from "nuqs";

import {globalParams} from "../params";

export const useGlobalParams = () => {
  return useQueryStates(globalParams);
};
