import {createElement} from "react";
import {renderHook} from "@testing-library/react";
import {
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
  useSuspenseComments,
  useSuspenseMyComments,
  useCreateComment,
  useReplyComment,
  useRemoveComment,
} from "@/features/comments/hooks/use-comments";

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

describe("useComments hooks", () => {
  const mockTRPC = {
    comment: {
      getAll: {queryOptions: jest.fn()},
      getMyAll: {queryOptions: jest.fn()},
      create: {mutationOptions: jest.fn()},
      reply: {mutationOptions: jest.fn()},
      remove: {mutationOptions: jest.fn()},
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

  it("useSuspenseComments calls getAll with releaseId and params", () => {
    mockTRPC.comment.getAll.queryOptions.mockReturnValue({queryKey: ["test"]});
    renderHook(() => useSuspenseComments("r1"), {wrapper});
    expect(mockTRPC.comment.getAll.queryOptions).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      releaseId: "r1",
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["test"]});
  });

  it("useSuspenseMyComments calls getMyAll with params", () => {
    mockTRPC.comment.getMyAll.queryOptions.mockReturnValue({
      queryKey: ["test"],
    });
    renderHook(() => useSuspenseMyComments(), {wrapper});
    expect(mockTRPC.comment.getMyAll.queryOptions).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["test"]});
  });

  it("useCreateComment calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useCreateComment(), {wrapper});
    const options = mockTRPC.comment.create.mutationOptions.mock.calls[0][0];

    options.onSuccess({releaseId: "r1"});
    expect(toast.success).toHaveBeenCalledWith("Comment created successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useReplyComment calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useReplyComment(), {wrapper});
    const options = mockTRPC.comment.reply.mutationOptions.mock.calls[0][0];

    options.onSuccess({releaseId: "r1"});
    expect(toast.success).toHaveBeenCalledWith("Reply created successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useRemoveComment calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useRemoveComment(), {wrapper});
    const options = mockTRPC.comment.remove.mutationOptions.mock.calls[0][0];

    options.onSuccess({releaseId: "r1"});
    expect(toast.success).toHaveBeenCalledWith("Comment removed successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useCreateComment calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useCreateComment(), {wrapper});
    const options = mockTRPC.comment.create.mutationOptions.mock.calls[0][0];

    options.onError({message: "Create failed"});
    expect(toast.error).toHaveBeenCalledWith("Create failed");
  });

  it("useReplyComment calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useReplyComment(), {wrapper});
    const options = mockTRPC.comment.reply.mutationOptions.mock.calls[0][0];

    options.onError({message: "Reply failed"});
    expect(toast.error).toHaveBeenCalledWith("Reply failed");
  });

  it("useRemoveComment calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useRemoveComment(), {wrapper});
    const options = mockTRPC.comment.remove.mutationOptions.mock.calls[0][0];

    options.onError({message: "Remove failed"});
    expect(toast.error).toHaveBeenCalledWith("Remove failed");
  });
});
