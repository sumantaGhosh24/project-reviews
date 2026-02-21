import {prefetch, trpc} from "@/trpc/server";
import {
  prefetchRelease,
  prefetchReleases,
} from "@/features/releases/server/prefetch";

jest.mock("@/trpc/server", () => {
  const prefetch = jest.fn();
  const trpc = {
    release: {
      getOne: {queryOptions: jest.fn()},
      getAll: {queryOptions: jest.fn()},
    },
  };

  return {prefetch, trpc};
});

describe("releases prefetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prefetches a single release", async () => {
    const id = "r1";
    const options = {queryKey: ["release"], queryFn: jest.fn()};
    (trpc.release.getOne.queryOptions as jest.Mock).mockReturnValue(options);

    await prefetchRelease(id);

    expect(trpc.release.getOne.queryOptions).toHaveBeenCalledWith({id});
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches releases list", async () => {
    const params = {page: 1, pageSize: 10, projectId: "p1"};
    const options = {queryKey: ["releases"], queryFn: jest.fn()};
    (trpc.release.getAll.queryOptions as jest.Mock).mockReturnValue(options);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prefetchReleases(params as any);

    expect(trpc.release.getAll.queryOptions).toHaveBeenCalledWith(params);
    expect(prefetch).toHaveBeenCalledWith(options);
  });
});
