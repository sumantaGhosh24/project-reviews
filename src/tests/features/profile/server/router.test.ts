import {TRPCError} from "@trpc/server";

import prisma from "@/lib/db";
import {auth} from "@/lib/auth/auth";
import {profileRouter} from "@/features/profile/server/router";

describe("profileRouter", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx: any = {
    auth: {
      user: {id: "u1", name: "User 1"},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
      user: {id: "u1", name: "User 1", role: "user"},
      session: {id: "s1"},
    });
  });

  describe("getUser", () => {
    it("returns user profile with stats", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "u2",
        name: "User 2",
      });
      (prisma.follow.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.follow.count as jest.Mock).mockResolvedValue(10);
      (prisma.project.count as jest.Mock).mockResolvedValue(5);

      const caller = profileRouter.createCaller(ctx);
      const result = await caller.getUser({id: "u2"});

      expect(result.id).toBe("u2");
      expect(result.isFollowing).toBe(false);
      expect(result.isActiveUser).toBe(false);
      expect(result.followersCount).toBe(10);
      expect(result.projectsCount).toBe(5);
    });
  });

  describe("handleFollow", () => {
    it("creates a follow and notification if not following", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({id: "u2"});
      (prisma.follow.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = profileRouter.createCaller(ctx);
      const result = await caller.handleFollow({userId: "u2"});

      expect(prisma.follow.create).toHaveBeenCalledWith({
        data: {followerId: "u1", followingId: "u2"},
      });
      expect(prisma.notification.create).toHaveBeenCalled();
      expect(result.user.id).toBe("u2");
    });

    it("deletes a follow if already following", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({id: "u2"});
      (prisma.follow.findUnique as jest.Mock).mockResolvedValue({id: "f1"});

      const caller = profileRouter.createCaller(ctx);
      await caller.handleFollow({userId: "u2"});

      expect(prisma.follow.delete).toHaveBeenCalled();
      expect(prisma.notification.create).not.toHaveBeenCalled();
    });

    it("throws error if trying to follow self", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({id: "u1"});

      const caller = profileRouter.createCaller(ctx);
      await expect(caller.handleFollow({userId: "u1"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't follow yourself.",
        })
      );
    });

    it("throws error for invalid user id", async () => {
      const caller = profileRouter.createCaller(ctx);

      await expect(caller.handleFollow({userId: ""})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid user id.",
        })
      );
    });

    it("throws error when user does not exist", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = profileRouter.createCaller(ctx);

      await expect(caller.handleFollow({userId: "missing"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "User not exists.",
        })
      );
    });
  });

  describe("getFollowers", () => {
    it("returns paginated followers", async () => {
      (prisma.follow.findMany as jest.Mock).mockResolvedValue([
        {follower: {id: "u2", name: "User 2"}},
      ]);
      (prisma.follow.count as jest.Mock).mockResolvedValue(1);
      (prisma.follow.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = profileRouter.createCaller(ctx);
      const result = await caller.getFollowers({
        id: "u1",
        page: 1,
        pageSize: 10,
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe("u2");
      expect(result.totalCount).toBe(1);
    });
  });

  describe("getFollowings", () => {
    it("returns paginated followings with flags", async () => {
      (prisma.follow.findMany as jest.Mock).mockResolvedValue([
        {
          following: {
            id: "u2",
            name: "User 2",
            email: "u2@example.com",
            image: "img",
          },
        },
      ]);
      (prisma.follow.count as jest.Mock).mockResolvedValue(1);
      (prisma.follow.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = profileRouter.createCaller(ctx);
      const result = await caller.getFollowings({
        id: "u1",
        page: 1,
        pageSize: 10,
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe("u2");
      expect(result.items[0].isFollowing).toBe(false);
      expect(result.items[0].isActiveUser).toBe(false);
      expect(result.totalCount).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });
  });
});
