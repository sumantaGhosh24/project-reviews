import {TRPCError} from "@trpc/server";

import prisma from "@/lib/db";
import {auth} from "@/lib/auth/auth";
import {commentsRouter} from "@/features/comments/server/router";

describe("commentsRouter", () => {
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

  describe("create", () => {
    it("creates a comment and a notification", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue({
        id: "r1",
        project: {id: "p1", ownerId: "owner1"},
      });
      (prisma.comment.create as jest.Mock).mockResolvedValue({id: "c1"});

      const caller = commentsRouter.createCaller(ctx);
      const result = await caller.create({
        releaseId: "r1",
        body: "Test comment",
      });

      expect(result).toEqual({id: "c1"});
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          body: "Test comment",
          image: null,
          authorId: "u1",
          releaseId: "r1",
        },
      });
      expect(prisma.notification.create).toHaveBeenCalled();
    });

    it("throws error if release does not exist", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue(null);

      const caller = commentsRouter.createCaller(ctx);
      await expect(
        caller.create({releaseId: "invalid", body: "test"})
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        })
      );
    });
  });

  describe("reply", () => {
    it("creates a reply and notifications for release owner and parent author", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue({
        id: "r1",
        project: {id: "p1", ownerId: "owner1"},
      });
      (prisma.comment.findFirst as jest.Mock).mockResolvedValue({
        id: "parent1",
        author: {id: "u2"},
      });
      (prisma.comment.create as jest.Mock).mockResolvedValue({id: "reply1"});

      const caller = commentsRouter.createCaller(ctx);
      const result = await caller.reply({
        releaseId: "r1",
        commentId: "parent1",
        body: "Test reply",
      });

      expect(result).toEqual({id: "reply1"});
      expect(prisma.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({parentId: "parent1"}),
        })
      );
      expect(prisma.notification.create).toHaveBeenCalledTimes(2);
    });

    it("throws error if release does not exist", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue(null);

      const caller = commentsRouter.createCaller(ctx);
      await expect(
        caller.reply({releaseId: "invalid", commentId: "parent1", body: "test"})
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        })
      );
    });

    it("throws error if comment does not exist", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue({id: "r1"});
      (prisma.comment.findFirst as jest.Mock).mockResolvedValue(null);

      const caller = commentsRouter.createCaller(ctx);
      await expect(
        caller.reply({releaseId: "r1", commentId: "invalid", body: "test"})
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This comment does not exists.",
        })
      );
    });
  });

  describe("remove", () => {
    it("marks a comment as deleted if user is author", async () => {
      (prisma.comment.update as jest.Mock).mockResolvedValue({id: "c1"});

      const caller = commentsRouter.createCaller(ctx);
      const result = await caller.remove({id: "c1"});

      expect(result).toEqual({id: "c1"});
      expect(prisma.comment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {id: "c1", authorId: "u1"},
          data: expect.objectContaining({body: "[deleted]"}),
        })
      );
    });

    it("throws error if comment does not exist or user is not author", async () => {
      (prisma.comment.update as jest.Mock).mockRejectedValue(
        new Error("Record to update not found")
      );

      const caller = commentsRouter.createCaller(ctx);
      await expect(caller.remove({id: "invalid"})).rejects.toThrow();
    });

    it("throws TRPCError if updated comment is null", async () => {
      (prisma.comment.update as jest.Mock).mockResolvedValue(null);

      const caller = commentsRouter.createCaller(ctx);
      await expect(caller.remove({id: "c1"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This comment does not exists.",
        })
      );
    });
  });

  describe("getOne", () => {
    it("returns comment with votes and myVote", async () => {
      (prisma.comment.findFirst as jest.Mock).mockResolvedValue({id: "c1"});
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue({type: "UPVOTE"});

      const caller = commentsRouter.createCaller(ctx);
      const result = await caller.getOne({id: "c1"});

      expect(result).toEqual({
        id: "c1",
        votes: [],
        myVote: {type: "UPVOTE"},
      });
    });

    it("throws error if comment does not exist", async () => {
      (prisma.comment.findFirst as jest.Mock).mockResolvedValue(null);

      const caller = commentsRouter.createCaller(ctx);
      await expect(caller.getOne({id: "invalid"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This comment does not exists.",
        })
      );
    });
  });

  describe("getAll", () => {
    it("returns paginated comments with votes", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue({id: "r1"});
      (prisma.comment.findMany as jest.Mock).mockResolvedValue([
        {id: "c1", authorId: "u1"},
      ]);
      (prisma.comment.count as jest.Mock).mockResolvedValue(1);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = commentsRouter.createCaller(ctx);
      const result = await caller.getAll({
        releaseId: "r1",
        page: 1,
        pageSize: 10,
      });

      expect(result.items[0]).toMatchObject({id: "c1", isOwner: true});
      expect(result.totalCount).toBe(1);
    });

    it("throws error if release does not exist", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue(null);

      const caller = commentsRouter.createCaller(ctx);
      await expect(
        caller.getAll({releaseId: "invalid", page: 1, pageSize: 10})
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        })
      );
    });
  });

  describe("getMyAll", () => {
    it("returns comments by the current user", async () => {
      (prisma.comment.findMany as jest.Mock).mockResolvedValue([{id: "c1"}]);
      (prisma.comment.count as jest.Mock).mockResolvedValue(1);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);

      const caller = commentsRouter.createCaller(ctx);
      const result = await caller.getMyAll({page: 1, pageSize: 10});

      expect(result.items[0].id).toBe("c1");
      expect(result.totalCount).toBe(1);
    });
  });
});
