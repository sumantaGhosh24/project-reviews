import type {inferInput} from "@trpc/tanstack-react-query";

import {prefetch, trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.comment.getAll>;

type InputMy = inferInput<typeof trpc.comment.getMyAll>;

export const prefetchComments = async (params: Input) => {
  await prefetch(trpc.comment.getAll.queryOptions(params));
};

export const prefetchMyComments = async (params: InputMy) => {
  await prefetch(trpc.comment.getMyAll.queryOptions(params));
};
