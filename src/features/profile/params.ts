import {parseAsInteger} from "nuqs/server";

import {PAGINATION} from "@/constants/pagination";

export const profileParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({clearOnDefault: true}),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({clearOnDefault: true}),
};
