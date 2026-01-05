import {parseAsInteger, parseAsString} from "nuqs/server";

import {PAGINATION} from "@/constants/pagination";

export const projectsParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({clearOnDefault: true}),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({clearOnDefault: true}),
  search: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
  category: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
};
