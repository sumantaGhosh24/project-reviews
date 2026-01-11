import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";

import {useProfileParams} from "./use-profile-params";

export const useSuspenseUser = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.profile.getUser.queryOptions({id}));
};

export const useSuspenseFollowers = (id: string) => {
  const trpc = useTRPC();

  const [params] = useProfileParams();

  return useSuspenseQuery(
    trpc.profile.getFollowers.queryOptions({id, ...params})
  );
};

export const useSuspenseFollowings = (id: string) => {
  const trpc = useTRPC();

  const [params] = useProfileParams();

  return useSuspenseQuery(
    trpc.profile.getFollowings.queryOptions({id, ...params})
  );
};

export const useHandleFollow = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.profile.handleFollow.mutationOptions({
      onSuccess: (data) => {
        toast.success("Follow successful");

        queryClient.invalidateQueries(
          trpc.profile.getUser.queryOptions({id: data.user.id})
        );
        queryClient.invalidateQueries(
          trpc.profile.getUser.queryOptions({id: data.currentUser.id})
        );
        queryClient.invalidateQueries(
          trpc.profile.getFollowers.queryOptions({id: data.user.id})
        );
        queryClient.invalidateQueries(
          trpc.profile.getFollowers.queryOptions({id: data.currentUser.id})
        );
        queryClient.invalidateQueries(
          trpc.profile.getFollowings.queryOptions({id: data.user.id})
        );
        queryClient.invalidateQueries(
          trpc.profile.getFollowings.queryOptions({id: data.currentUser.id})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};
