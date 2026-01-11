import type {inferInput} from "@trpc/tanstack-react-query";

import {prefetch, trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.category.getAllPaginated>;

export const prefetchCategories = async (params: Input) => {
  await prefetch(trpc.category.getAllPaginated.queryOptions(params));
};

export const prefetchAllCategory = async () => {
  await prefetch(trpc.category.getAll.queryOptions());
};

export const prefetchCategory = async (id: string) => {
  await prefetch(trpc.category.getOne.queryOptions({id}));
};
