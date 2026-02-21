import {createElement} from "react";
import {renderHook} from "@testing-library/react";
import {
  useSuspenseQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {toast} from "sonner";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {
  useSuspenseUser,
  useSuspenseFollowers,
  useSuspenseFollowings,
  useHandleFollow,
} from "@/features/profile/hooks/use-profile";

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

describe("useProfile hooks", () => {
  const mockTRPC = {
    profile: {
      getUser: {queryOptions: jest.fn()},
      getFollowers: {queryOptions: jest.fn()},
      getFollowings: {queryOptions: jest.fn()},
      handleFollow: {mutationOptions: jest.fn()},
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
    createElement(QueryClientProvider, {client: queryClient}, children);

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
    (useTRPC as jest.Mock).mockReturnValue(mockTRPC);
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1, pageSize: 10}]);
  });

  it("useSuspenseUser calls getUser.queryOptions", () => {
    mockTRPC.profile.getUser.queryOptions.mockReturnValue({queryKey: ["user"]});
    renderHook(() => useSuspenseUser("u1"), {wrapper});
    expect(mockTRPC.profile.getUser.queryOptions).toHaveBeenCalledWith({
      id: "u1",
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["user"]});
  });

  it("useSuspenseFollowers calls getFollowers.queryOptions with params", () => {
    mockTRPC.profile.getFollowers.queryOptions.mockReturnValue({
      queryKey: ["followers"],
    });
    renderHook(() => useSuspenseFollowers("u1"), {wrapper});
    expect(mockTRPC.profile.getFollowers.queryOptions).toHaveBeenCalledWith({
      id: "u1",
      page: 1,
      pageSize: 10,
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["followers"]});
  });

  it("useSuspenseFollowings calls getFollowings.queryOptions with params", () => {
    mockTRPC.profile.getFollowings.queryOptions.mockReturnValue({
      queryKey: ["followings"],
    });
    renderHook(() => useSuspenseFollowings("u1"), {wrapper});
    expect(mockTRPC.profile.getFollowings.queryOptions).toHaveBeenCalledWith({
      id: "u1",
      page: 1,
      pageSize: 10,
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["followings"]});
  });

  it("useHandleFollow calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useHandleFollow());
    const options =
      mockTRPC.profile.handleFollow.mutationOptions.mock.calls[0][0];

    options.onSuccess({
      user: {id: "u1"},
      currentUser: {id: "u2"},
    });
    expect(toast.success).toHaveBeenCalledWith("Follow successful");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(6);
  });

  it("useHandleFollow calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useHandleFollow());
    const options =
      mockTRPC.profile.handleFollow.mutationOptions.mock.calls[0][0];

    options.onError({message: "Follow failed"});
    expect(toast.error).toHaveBeenCalledWith("Follow failed");
  });
});
