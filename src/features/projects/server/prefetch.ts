import type {inferInput} from "@trpc/tanstack-react-query";

import {prefetch, trpc} from "@/trpc/server";

type InputAll = inferInput<typeof trpc.project.getAll>;

type InputPublic = inferInput<typeof trpc.project.getPublic>;

type InputMy = inferInput<typeof trpc.project.getMyAll>;

type InputUser = inferInput<typeof trpc.project.getUserAll>;

export const prefetchProject = async (id: string) => {
  await prefetch(trpc.project.getOne.queryOptions({id}));
};

export const prefetchAllProjects = async (params: InputAll) => {
  await prefetch(trpc.project.getAll.queryOptions(params));
};

export const prefetchPublicProjects = async (params: InputPublic) => {
  await prefetch(trpc.project.getPublic.queryOptions(params));
};

export const prefetchMyProjects = async (params: InputMy) => {
  await prefetch(trpc.project.getMyAll.queryOptions(params));
};

export const prefetchUserProjects = async (params: InputUser) => {
  await prefetch(trpc.project.getUserAll.queryOptions(params));
};

export const prefetchViewProject = async (id: string) => {
  await prefetch(trpc.project.view.queryOptions({id}));
};
