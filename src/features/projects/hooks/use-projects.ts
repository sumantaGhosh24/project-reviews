import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";

import {useProjectsParams} from "./use-projects-params";

export const useSuspenseProject = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.project.getOne.queryOptions({id}));
};

export const useSuspenseAllProjects = () => {
  const trpc = useTRPC();

  const [params] = useProjectsParams();

  return useSuspenseQuery(trpc.project.getAll.queryOptions(params));
};

export const useSuspensePublicProjects = () => {
  const trpc = useTRPC();

  const [params] = useProjectsParams();

  return useSuspenseQuery(trpc.project.getPublic.queryOptions(params));
};

export const useSuspenseMyProjects = () => {
  const trpc = useTRPC();

  const [params] = useProjectsParams();

  return useSuspenseQuery(trpc.project.getMyAll.queryOptions(params));
};

export const useSuspenseUserProjects = (userId: string) => {
  const trpc = useTRPC();

  const [params] = useProjectsParams();

  return useSuspenseQuery(
    trpc.project.getUserAll.queryOptions({userId, ...params})
  );
};

export const useSuspenseViewProject = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.project.view.queryOptions({id}));
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.project.create.mutationOptions({
      onSuccess: () => {
        toast.success("Project created successfully");

        queryClient.invalidateQueries(trpc.project.getAll.queryOptions({}));
        queryClient.invalidateQueries(trpc.project.getMyAll.queryOptions({}));
        queryClient.invalidateQueries(trpc.project.getPublic.queryOptions({}));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.project.update.mutationOptions({
      onSuccess: (data) => {
        toast.success("Project updated successfully");

        queryClient.invalidateQueries(
          trpc.project.getOne.queryOptions({id: data.id})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

export const useRemoveProject = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.project.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Project removed successfully");

        queryClient.invalidateQueries(trpc.project.getAll.queryOptions({}));
        queryClient.invalidateQueries(trpc.project.getMyAll.queryOptions({}));
        queryClient.invalidateQueries(trpc.project.getPublic.queryOptions({}));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};
