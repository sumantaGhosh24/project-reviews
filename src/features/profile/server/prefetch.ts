import type {inferInput} from "@trpc/tanstack-react-query";

import {prefetch, trpc} from "@/trpc/server";

type FollowersInput = inferInput<typeof trpc.profile.getFollowers>;

type FollowingsInput = inferInput<typeof trpc.profile.getFollowings>;

export const prefetchUser = async (id: string) => {
  await prefetch(trpc.profile.getUser.queryOptions({id}));
};

export const prefetchFollowers = async (params: FollowersInput) => {
  await prefetch(trpc.profile.getFollowers.queryOptions(params));
};

export const prefetchFollowings = async (params: FollowingsInput) => {
  await prefetch(trpc.profile.getFollowings.queryOptions(params));
};
