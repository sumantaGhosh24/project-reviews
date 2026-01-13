import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";

import {useNotificationsParams} from "./use-notifications-params";

export const useSuspenseNotifications = () => {
  const trpc = useTRPC();

  const [params] = useNotificationsParams();

  return useSuspenseQuery(trpc.notification.getAll.queryOptions(params));
};

export const useReadAllNotification = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.notification.readAll.mutationOptions({
      onSuccess: () => {
        toast.success("All notification read");

        queryClient.invalidateQueries(
          trpc.notification.getAll.queryOptions({})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.notification.readOne.mutationOptions({
      onSuccess: () => {
        toast.success("Notification read");

        queryClient.invalidateQueries(
          trpc.notification.getAll.queryOptions({})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};
