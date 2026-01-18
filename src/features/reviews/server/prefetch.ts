import type {inferInput} from "@trpc/tanstack-react-query";

import {prefetch, trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.review.getAll>;

type InputMy = inferInput<typeof trpc.review.getMyAll>;

export const prefetchReviews = async (params: Input) => {
  await prefetch(trpc.review.getAll.queryOptions(params));
};

export const prefetchMyReviews = async (params: InputMy) => {
  await prefetch(trpc.review.getMyAll.queryOptions(params));
};
