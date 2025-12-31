import {useQueryStates} from "nuqs";

import {categoriesParams} from "../params";

export const useCategoriesParams = () => {
  return useQueryStates(categoriesParams);
};
