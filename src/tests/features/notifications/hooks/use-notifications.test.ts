import {createElement} from "react";
import {renderHook} from "@testing-library/react";
import {
  useQuery,
  useSuspenseQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {
  useNotificationCount,
  useSuspenseNotifications,
  useReadAllNotification,
  useReadNotification,
} from "@/features/notifications/hooks/use-notifications";

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

describe("useNotifications hooks", () => {
  const mockTRPC = {
    notification: {
      notificationCount: {queryOptions: jest.fn()},
      getAll: {queryOptions: jest.fn()},
      readAll: {mutationOptions: jest.fn()},
      readOne: {mutationOptions: jest.fn()},
    },
  };

  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  };

  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  let queryClient: QueryClient;

  const wrapper = ({children}: {children: React.ReactNode}) =>
    createElement(
      QueryClientProvider,
      {client: queryClient},
      children
    );

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
    (useTRPC as jest.Mock).mockReturnValue(mockTRPC);
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1, pageSize: 10}]);
  });

  it("useNotificationCount calls notificationCount.queryOptions", () => {
    mockTRPC.notification.notificationCount.queryOptions.mockReturnValue({
      queryKey: ["test"],
    });
    renderHook(() => useNotificationCount(), {wrapper});
    expect(
      mockTRPC.notification.notificationCount.queryOptions
    ).toHaveBeenCalled();
    expect(useQuery).toHaveBeenCalledWith({queryKey: ["test"]});
  });

  it("useSuspenseNotifications calls getAll.queryOptions with params", () => {
    mockTRPC.notification.getAll.queryOptions.mockReturnValue({
      queryKey: ["test"],
    });
    renderHook(() => useSuspenseNotifications(), {wrapper});
    expect(mockTRPC.notification.getAll.queryOptions).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["test"]});
  });

  it("useReadAllNotification calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useReadAllNotification(), {wrapper});
    const options =
      mockTRPC.notification.readAll.mutationOptions.mock.calls[0][0];

    options.onSuccess();
    expect(toast.success).toHaveBeenCalledWith("All notification read");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(2);
  });

  it("useReadNotification calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useReadNotification(), {wrapper});
    const options =
      mockTRPC.notification.readOne.mutationOptions.mock.calls[0][0];

    options.onSuccess();
    expect(toast.success).toHaveBeenCalledWith("Notification read");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(2);
  });

  it("useReadAllNotification calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useReadAllNotification(), {wrapper});
    const options =
      mockTRPC.notification.readAll.mutationOptions.mock.calls[0][0];

    options.onError({message: "Failed to read all notifications"});
    expect(toast.error).toHaveBeenCalledWith(
      "Failed to read all notifications"
    );
  });

  it("useReadNotification calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useReadNotification(), {wrapper});
    const options =
      mockTRPC.notification.readOne.mutationOptions.mock.calls[0][0];

    options.onError({message: "Failed to read notification"});
    expect(toast.error).toHaveBeenCalledWith("Failed to read notification");
  });
});
