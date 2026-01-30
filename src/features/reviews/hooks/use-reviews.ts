import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";

export const useSuspenseReviews = (releaseId: string) => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

  return useSuspenseQuery(
    trpc.review.getAll.queryOptions({...params, releaseId})
  );
};

export const useSuspenseMyReviews = () => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

  return useSuspenseQuery(trpc.review.getMyAll.queryOptions(params));
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.review.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Review created successfully");

        queryClient.invalidateQueries(
          trpc.review.getAll.queryOptions({releaseId: data.releaseId})
        );
        queryClient.invalidateQueries(
          trpc.release.getOne.queryOptions({id: data.releaseId})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

export const useRemoveReview = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.review.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success("Review removed successfully");

        queryClient.invalidateQueries(
          trpc.review.getAll.queryOptions({releaseId: data.releaseId})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};
