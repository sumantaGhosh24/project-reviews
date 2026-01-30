import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";

export const useSuspenseRelease = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.release.getOne.queryOptions({id}));
};

export const useSuspenseReleases = (projectId: string) => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

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

export const useAddReleaseImage = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.release.addImage.mutationOptions({
      onSuccess: (data) => {
        toast.success("Release image added successfully");

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

export const useRemoveReleaseImage = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.release.removeImage.mutationOptions({
      onSuccess: (data) => {
        toast.success("Release image removed successfully");

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
