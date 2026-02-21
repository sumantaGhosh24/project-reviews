import {createElement} from "react";
import {renderHook} from "@testing-library/react";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {toast} from "sonner";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {
  useSuspenseReviews,
  useSuspenseMyReviews,
  useCreateReview,
  useRemoveReview,
} from "@/features/reviews/hooks/use-reviews";

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

describe("use-reviews hooks", () => {
  const mockTRPC = {
    review: {
      getAll: {queryOptions: jest.fn()},
      getMyAll: {queryOptions: jest.fn()},
      create: {mutationOptions: jest.fn()},
      remove: {mutationOptions: jest.fn()},
    },
    release: {
      getOne: {queryOptions: jest.fn()},
    },
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

  beforeEach(() => {
    queryClient = createTestQueryClient();
    jest.clearAllMocks();
    (useTRPC as jest.Mock).mockReturnValue(mockTRPC);
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1}, jest.fn()]);
  });

  describe("useSuspenseReviews", () => {
    it("calls useSuspenseQuery with correct options", () => {
      const mockOptions = {queryKey: ["reviews"], queryFn: jest.fn()};
      mockTRPC.review.getAll.queryOptions.mockReturnValue(mockOptions);

      const wrapper = ({children}: {children: React.ReactNode}) =>
        createElement(QueryClientProvider, {client: queryClient}, children);

      renderHook(() => useSuspenseReviews("rel-123"), {wrapper});

      expect(mockTRPC.review.getAll.queryOptions).toHaveBeenCalledWith({
        page: 1,
        releaseId: "rel-123",
      });
      expect(useSuspenseQuery).toHaveBeenCalledWith(mockOptions);
    });
  });

  describe("useSuspenseMyReviews", () => {
    it("calls useSuspenseQuery with correct options", () => {
      const mockOptions = {queryKey: ["my-reviews"], queryFn: jest.fn()};
      mockTRPC.review.getMyAll.queryOptions.mockReturnValue(mockOptions);

      const wrapper = ({children}: {children: React.ReactNode}) =>
        createElement(QueryClientProvider, {client: queryClient}, children);

      renderHook(() => useSuspenseMyReviews(), {wrapper});

      expect(mockTRPC.review.getMyAll.queryOptions).toHaveBeenCalledWith({
        page: 1,
      });
      expect(useSuspenseQuery).toHaveBeenCalledWith(mockOptions);
    });
  });

  describe("useCreateReview", () => {
    it("calls useMutation with correct options and handles onSuccess", () => {
      const mockMutationOptions = {mutationFn: jest.fn()};
      mockTRPC.review.create.mutationOptions.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (options: any) => {
          if (options?.onSuccess) {
            options.onSuccess({releaseId: "rel-123"});
          }
          return mockMutationOptions;
        }
      );

      const mockQueryClient = {
        invalidateQueries: jest.fn(),
      };
      (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);

      const wrapper = ({children}: {children: React.ReactNode}) =>
        createElement(QueryClientProvider, {client: queryClient}, children);

      renderHook(() => useCreateReview(), {wrapper});

      expect(useMutation).toHaveBeenCalledWith(mockMutationOptions);
      expect(toast.success).toHaveBeenCalledWith("Review created successfully");
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(2);
    });

    it("handles onError", () => {
      mockTRPC.review.create.mutationOptions.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (options: any) => {
          if (options?.onError) {
            options.onError({message: "Error message"});
          }
          return {};
        }
      );

      const wrapper = ({children}: {children: React.ReactNode}) =>
        createElement(QueryClientProvider, {client: queryClient}, children);

      renderHook(() => useCreateReview(), {wrapper});

      expect(toast.error).toHaveBeenCalledWith("Error message");
    });
  });

  describe("useRemoveReview", () => {
    it("calls useMutation with correct options and handles onSuccess", () => {
      const mockMutationOptions = {mutationFn: jest.fn()};
      mockTRPC.review.remove.mutationOptions.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (options: any) => {
          if (options?.onSuccess) {
            options.onSuccess({releaseId: "rel-123"});
          }
          return mockMutationOptions;
        }
      );

      const mockQueryClient = {
        invalidateQueries: jest.fn(),
      };
      (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);

      const wrapper = ({children}: {children: React.ReactNode}) =>
        createElement(QueryClientProvider, {client: queryClient}, children);

      renderHook(() => useRemoveReview(), {wrapper});

      expect(useMutation).toHaveBeenCalledWith(mockMutationOptions);
      expect(toast.success).toHaveBeenCalledWith("Review removed successfully");
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(1);
    });

    it("handles onError", () => {
      mockTRPC.review.remove.mutationOptions.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (options: any) => {
          if (options?.onError) {
            options.onError({message: "Error message"});
          }
          return {};
        }
      );

      const wrapper = ({children}: {children: React.ReactNode}) =>
        createElement(QueryClientProvider, {client: queryClient}, children);

      renderHook(() => useRemoveReview(), {wrapper});

      expect(toast.error).toHaveBeenCalledWith("Error message");
    });
  });
});
