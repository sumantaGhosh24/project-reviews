import {headers} from "next/headers";

import prisma from "@/lib/db";
import {createCallerFactory} from "@/trpc/init";
import {auth} from "@/lib/auth/auth";
import {reviewsRouter} from "@/features/reviews/server/router";

const createCaller = createCallerFactory(reviewsRouter);

describe("reviewsRouter", () => {
  const mockUser = {id: "user-1", name: "Test User"};
  const mockSession = {user: mockUser};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockCtx = {} as any;
  const caller = createCaller(mockCtx);

  beforeEach(() => {
    jest.clearAllMocks();
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(
      mockSession
    );
    (headers as jest.Mock).mockResolvedValue(new Map());
  });

  describe("create", () => {
    const input = {
      releaseId: "rel-1",
      rating: 5,
      feedback: "Great!",
    };

    it("creates a review successfully", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue({
        id: "rel-1",
        project: {id: "proj-1", ownerId: "owner-1"},
      });
      (prisma.review.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.review.create as jest.Mock).mockResolvedValue({
        id: "rev-1",
        ...input,
      });

      const result = await caller.create(input);

      expect(result.id).toBe("rev-1");
      expect(prisma.notification.create).toHaveBeenCalled();
    });

    it("throws if release does not exist", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(caller.create(input)).rejects.toThrow(
        "This release does not exists."
      );
    });

    it("throws if review already exists", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue({
        id: "rel-1",
        project: {id: "proj-1", ownerId: "owner-1"},
      });
      (prisma.review.findFirst as jest.Mock).mockResolvedValue({
        id: "existing",
      });

      await expect(caller.create(input)).rejects.toThrow(
        "You already have a review on this release."
      );
    });
  });

  describe("remove", () => {
    it("removes a review successfully", async () => {
      (prisma.review.delete as jest.Mock).mockResolvedValue({id: "rev-1"});

      const result = await caller.remove({id: "rev-1"});

      expect(result.id).toBe("rev-1");
      expect(prisma.review.delete).toHaveBeenCalledWith({
        where: {id: "rev-1", authorId: mockUser.id},
      });
    });

    it("throws if review does not exist or not author", async () => {
      (prisma.review.delete as jest.Mock).mockResolvedValue(null);

      await expect(caller.remove({id: "rev-1"})).rejects.toThrow(
        "This review does not exists."
      );
    });
  });

  describe("getOne", () => {
    it("returns a review", async () => {
      (prisma.review.findFirst as jest.Mock).mockResolvedValue({id: "rev-1"});
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([
        {type: "UP", _count: 5},
      ]);
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue({type: "UP"});

      const result = await caller.getOne({id: "rev-1"});

      expect(result.id).toBe("rev-1");
      expect(result.votes).toHaveLength(1);
      expect(result.myVote).toEqual({type: "UP"});
    });

    it("throws if review not found", async () => {
      (prisma.review.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(caller.getOne({id: "rev-1"})).rejects.toThrow(
        "This review does not exists."
      );
    });
  });

  describe("getAll", () => {
    const input = {releaseId: "rel-1", page: 1, pageSize: 10};

    it("returns all reviews for a release", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue({id: "rel-1"});
      (prisma.review.findMany as jest.Mock).mockResolvedValue([
        {id: "rev-1", authorId: mockUser.id},
      ]);
      (prisma.review.count as jest.Mock).mockResolvedValue(1);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await caller.getAll(input);

      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.items[0].isOwner).toBe(true);
    });

    it("throws if release does not exist", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(caller.getAll(input)).rejects.toThrow(
        "This release does not exists."
      );
    });
  });

  describe("getMyAll", () => {
    const input = {page: 1, pageSize: 10};

    it("returns all reviews for current user", async () => {
      (prisma.review.findMany as jest.Mock).mockResolvedValue([
        {id: "rev-1", authorId: mockUser.id},
      ]);
      (prisma.review.count as jest.Mock).mockResolvedValue(1);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);

      const result = await caller.getMyAll(input);

      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.items[0].isOwner).toBe(true);
    });
  });
});
