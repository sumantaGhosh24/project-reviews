/* eslint-disable @typescript-eslint/no-explicit-any */
import {prefetch, trpc} from "@/trpc/server";
import {
  prefetchUser,
  prefetchFollowers,
  prefetchFollowings,
} from "@/features/profile/server/prefetch";

jest.mock("@/trpc/server", () => {
  const prefetch = jest.fn();
  const trpc = {
    profile: {
      getUser: {queryOptions: jest.fn()},
      getFollowers: {queryOptions: jest.fn()},
      getFollowings: {queryOptions: jest.fn()},
    },
  };

  return {prefetch, trpc};
});

describe("profile prefetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prefetches user profile", async () => {
    const id = "user-1";
    const options = {queryKey: ["profile"], queryFn: jest.fn()};
    (trpc.profile.getUser.queryOptions as jest.Mock).mockReturnValue(options);

    await prefetchUser(id);

    expect(trpc.profile.getUser.queryOptions).toHaveBeenCalledWith({id});
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches followers", async () => {
    const params = {id: "user-1", page: 1, pageSize: 10};
    const options = {queryKey: ["followers"], queryFn: jest.fn()};
    (trpc.profile.getFollowers.queryOptions as jest.Mock).mockReturnValue(
      options
    );

    await prefetchFollowers(params as any);

    expect(trpc.profile.getFollowers.queryOptions).toHaveBeenCalledWith(params);
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches followings", async () => {
    const params = {id: "user-1", page: 1, pageSize: 10};
    const options = {queryKey: ["followings"], queryFn: jest.fn()};
    (trpc.profile.getFollowings.queryOptions as jest.Mock).mockReturnValue(
      options
    );

    await prefetchFollowings(params as any);

    expect(trpc.profile.getFollowings.queryOptions).toHaveBeenCalledWith(
      params
    );
    expect(prefetch).toHaveBeenCalledWith(options);
  });
});
