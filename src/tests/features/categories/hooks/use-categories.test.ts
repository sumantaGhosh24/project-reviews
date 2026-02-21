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
  useSuspenseCategories,
  useSuspenseAllCategories,
  useSuspenseCategory,
  useCreateCategory,
  useUpdateCategory,
  useRemoveCategory,
} from "@/features/categories/hooks/use-categories";

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

describe("useCategories hooks", () => {
  const mockTRPC = {
    category: {
      getAllPaginated: {queryOptions: jest.fn()},
      getAll: {queryOptions: jest.fn()},
      getOne: {queryOptions: jest.fn()},
      create: {mutationOptions: jest.fn()},
      update: {mutationOptions: jest.fn()},
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

  it("useSuspenseCategories calls getAllPaginated with params", () => {
    mockTRPC.category.getAllPaginated.queryOptions.mockReturnValue({
      queryKey: ["test"],
    });
    renderHook(() => useSuspenseCategories(), {wrapper});
    expect(mockTRPC.category.getAllPaginated.queryOptions).toHaveBeenCalledWith(
      {
        page: 1,
        pageSize: 10,
      }
    );
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["test"]});
  });

  it("useSuspenseAllCategories calls getAll", () => {
    mockTRPC.category.getAll.queryOptions.mockReturnValue({queryKey: ["test"]});
    renderHook(() => useSuspenseAllCategories(), {wrapper});
    expect(mockTRPC.category.getAll.queryOptions).toHaveBeenCalled();
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["test"]});
  });

  it("useSuspenseCategory calls getOne with id", () => {
    mockTRPC.category.getOne.queryOptions.mockReturnValue({queryKey: ["test"]});
    renderHook(() => useSuspenseCategory("1"), {wrapper});
    expect(mockTRPC.category.getOne.queryOptions).toHaveBeenCalledWith({
      id: "1",
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["test"]});
  });

  it("useCreateCategory calls mutation with correct options", () => {
    const mockMutation = {mutate: jest.fn()};
    (useMutation as jest.Mock).mockReturnValue(mockMutation);

    renderHook(() => useCreateCategory(), {wrapper});

    const mutationOptions =
      mockTRPC.category.create.mutationOptions.mock.calls[0][0];

    mutationOptions.onSuccess({id: "new-id"});
    expect(toast.success).toHaveBeenCalledWith(
      "Category created successfully new-id"
    );
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();

    mutationOptions.onError({message: "Failed"});
    expect(toast.error).toHaveBeenCalledWith("Failed");
  });

  it("useUpdateCategory calls mutation with correct options", () => {
    const mockMutation = {mutate: jest.fn()};
    (useMutation as jest.Mock).mockReturnValue(mockMutation);

    renderHook(() => useUpdateCategory(), {wrapper});

    const mutationOptions =
      mockTRPC.category.update.mutationOptions.mock.calls[0][0];

    mutationOptions.onSuccess({id: "updated-id"});
    expect(toast.success).toHaveBeenCalledWith("Category updated successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();

    mutationOptions.onError({message: "Failed"});
    expect(toast.error).toHaveBeenCalledWith("Failed");
  });

  it("useRemoveCategory calls mutation with correct options", () => {
    const mockMutation = {mutate: jest.fn()};
    (useMutation as jest.Mock).mockReturnValue(mockMutation);

    renderHook(() => useRemoveCategory(), {wrapper});

    const mutationOptions =
      mockTRPC.category.remove.mutationOptions.mock.calls[0][0];

    mutationOptions.onSuccess();
    expect(toast.success).toHaveBeenCalledWith("Category removed successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();

    mutationOptions.onError({message: "Failed"});
    expect(toast.error).toHaveBeenCalledWith("Failed");
  });
});
