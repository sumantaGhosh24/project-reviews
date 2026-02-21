import {prefetch, trpc} from "@/trpc/server";
import {
  prefetchComments,
  prefetchMyComments,
} from "@/features/comments/server/prefetch";

describe("comments prefetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prefetches comments for a release", async () => {
    const params = {releaseId: "r1", page: 1, pageSize: 10};
    await prefetchComments(params);

    expect(trpc.comment.getAll.queryOptions).toHaveBeenCalledWith(params);
    expect(prefetch).toHaveBeenCalledWith({queryKey: ["getAll", params]});
  });

  it("prefetches current user comments", async () => {
    const params = {page: 1, pageSize: 10};
    await prefetchMyComments(params);

    expect(trpc.comment.getMyAll.queryOptions).toHaveBeenCalledWith(params);
    expect(prefetch).toHaveBeenCalledWith({queryKey: ["getMyAll", params]});
  });
});
