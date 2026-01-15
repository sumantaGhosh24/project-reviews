import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";

import {useReleasesParams} from "./use-releases-params";

export const useSuspenseRelease = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.release.getOne.queryOptions({id}));
};

export const useSuspenseReleases = (projectId: string) => {
  const trpc = useTRPC();

  const [params] = useReleasesParams();

  return useSuspenseQuery(
    trpc.release.getAll.queryOptions({...params, projectId})
  );
};

export const useCreateRelease = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.release.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Release created successfully");

        queryClient.invalidateQueries(
          trpc.release.getOne.queryOptions({id: data.id})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

export const useUpdateRelease = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.release.update.mutationOptions({
      onSuccess: (data) => {
        toast.success("Release updated successfully");

        queryClient.invalidateQueries(
          trpc.release.getOne.queryOptions({id: data.id})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

export const useRemoveRelease = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.release.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success("Release removed successfully");

        queryClient.invalidateQueries(
          trpc.release.getOne.queryOptions({id: data.id})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};
