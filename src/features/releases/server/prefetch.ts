import type {inferInput} from "@trpc/tanstack-react-query";

import {prefetch, trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.release.getAll>;

export const prefetchRelease = async (id: string) => {
  await prefetch(trpc.release.getOne.queryOptions({id}));
};

export const prefetchReleases = async (params: Input) => {
  await prefetch(trpc.release.getAll.queryOptions(params));
};
