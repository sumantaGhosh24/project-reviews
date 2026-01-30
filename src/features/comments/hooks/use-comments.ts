import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";

export const useSuspenseComments = (releaseId: string) => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

  return useSuspenseQuery(
    trpc.comment.getAll.queryOptions({...params, releaseId})
  );
};

export const useSuspenseMyComments = () => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

  return useSuspenseQuery(trpc.comment.getMyAll.queryOptions(params));
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.comment.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Comment created successfully");

        queryClient.invalidateQueries(
          trpc.comment.getAll.queryOptions({releaseId: data.releaseId})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

export const useReplyComment = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.comment.reply.mutationOptions({
      onSuccess: (data) => {
        toast.success("Reply created successfully");

        queryClient.invalidateQueries(
          trpc.comment.getAll.queryOptions({releaseId: data.releaseId})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

export const useRemoveComment = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.comment.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success("Comment removed successfully");

        queryClient.invalidateQueries(
          trpc.comment.getAll.queryOptions({releaseId: data.releaseId})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};
