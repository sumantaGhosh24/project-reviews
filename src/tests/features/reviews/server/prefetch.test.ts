import {prefetch, trpc} from "@/trpc/server";
import {
  prefetchReviews,
  prefetchMyReviews,
} from "@/features/reviews/server/prefetch";

describe("prefetch reviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("prefetchReviews", () => {
    it("calls prefetch with correct options", async () => {
      const mockParams = {releaseId: "rel-123", page: 1};
      const mockOptions = {queryKey: ["reviews"], queryFn: jest.fn()};
      (trpc.review.getAll.queryOptions as jest.Mock).mockReturnValue(
        mockOptions
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await prefetchReviews(mockParams as any);

      expect(trpc.review.getAll.queryOptions).toHaveBeenCalledWith(mockParams);
      expect(prefetch).toHaveBeenCalledWith(mockOptions);
    });
  });

  describe("prefetchMyReviews", () => {
    it("calls prefetch with correct options", async () => {
      const mockParams = {page: 1};
      const mockOptions = {queryKey: ["my-reviews"], queryFn: jest.fn()};
      (trpc.review.getMyAll.queryOptions as jest.Mock).mockReturnValue(
        mockOptions
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await prefetchMyReviews(mockParams as any);

      expect(trpc.review.getMyAll.queryOptions).toHaveBeenCalledWith(
        mockParams
      );
      expect(prefetch).toHaveBeenCalledWith(mockOptions);
    });
  });
});
