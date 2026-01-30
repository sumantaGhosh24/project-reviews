import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";

export const useNotificationCount = () => {
  const trpc = useTRPC();

  return useQuery(trpc.notification.notificationCount.queryOptions());
};

export const useSuspenseNotifications = () => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

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
        queryClient.invalidateQueries(
          trpc.notification.notificationCount.queryOptions()
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
        queryClient.invalidateQueries(
          trpc.notification.notificationCount.queryOptions()
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};
