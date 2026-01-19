import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";

export const useVote = (releaseId?: string) => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.vote.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Vote created successfully");

        if (data.target === "PROJECT") {
          queryClient.invalidateQueries(
            trpc.project.getOne.queryOptions({id: data.targetId})
          );
          queryClient.invalidateQueries(
            trpc.project.view.queryOptions({id: data.targetId})
          );
        } else if (data.target === "RELEASE") {
          queryClient.invalidateQueries(
            trpc.release.getOne.queryOptions({id: data.targetId})
          );
        } else if (data.target === "COMMENT" && releaseId) {
          queryClient.invalidateQueries(
            trpc.comment.getOne.queryOptions({id: data.targetId})
          );
          queryClient.invalidateQueries(
            trpc.comment.getAll.queryOptions({releaseId})
          );
        } else if (data.target === "REVIEW" && releaseId) {
          queryClient.invalidateQueries(
            trpc.review.getOne.queryOptions({id: data.targetId})
          );
          queryClient.invalidateQueries(
            trpc.review.getAll.queryOptions({releaseId})
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};
