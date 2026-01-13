import type {inferInput} from "@trpc/tanstack-react-query";

import {prefetch, trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.notification.getAll>;

export const prefetchNotifications = async (params: Input) => {
  await prefetch(trpc.notification.getAll.queryOptions(params));
};
