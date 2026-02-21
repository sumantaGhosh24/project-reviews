import {TRPCError} from "@trpc/server";

import prisma from "@/lib/db";
import {auth} from "@/lib/auth/auth";
import {polarClient} from "@/lib/polar";
import {releasesRouter} from "@/features/releases/server/router";

describe("releasesRouter", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx: any = {
    auth: {
      user: {id: "u1", name: "User 1", role: "premium"},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
      user: {id: "u1", name: "User 1", role: "premium"},
      session: {id: "s1"},
    });
    (polarClient.customers.getStateExternal as jest.Mock).mockResolvedValue({
      activeSubscriptions: [{id: "sub1"}],
    });
  });

  describe("create", () => {
    it("creates a release with images", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue({id: "p1"});
      (prisma.release.create as jest.Mock).mockResolvedValue({id: "r1"});

      const caller = releasesRouter.createCaller(ctx);
      const result = await caller.create({
        projectId: "p1",
        title: "Release 1",
        description: "Desc",
        content: "Content",
        imageUrl: ["img1.jpg"],
      });

      expect(prisma.release.create).toHaveBeenCalled();
      expect(prisma.image.create).toHaveBeenCalled();
      expect(result.id).toBe("r1");
    });

    it("throws error if project does not exist", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue(null);

      const caller = releasesRouter.createCaller(ctx);
      await expect(
        caller.create({
          projectId: "invalid",
          title: "T",
          description: "D",
          content: "C",
          imageUrl: [],
        })
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Project does not exists.",
        })
      );
    });
  });

  describe("addImage", () => {
    it("adds images when release exists", async () => {
      (prisma.release.findUnique as jest.Mock).mockResolvedValue({id: "r1"});

      const caller = releasesRouter.createCaller(ctx);
      const result = await caller.addImage({
        id: "r1",
        imageUrl: ["img1.jpg", "img2.jpg"],
      });

      expect(prisma.image.create).toHaveBeenCalledTimes(2);
      expect(prisma.image.create).toHaveBeenCalledWith({
        data: {
          target: "RELEASE",
          targetId: "r1",
          url: "img1.jpg",
        },
      });
      expect(result.id).toBe("r1");
    });

    it("throws error if release does not exist", async () => {
      (prisma.release.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = releasesRouter.createCaller(ctx);

      await expect(
        caller.addImage({
          id: "r1",
          imageUrl: ["img1.jpg"],
        })
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Release does not exist.",
        })
      );
    });
  });

  describe("update", () => {
    it("updates release and sends notifications if public", async () => {
      (prisma.release.findUnique as jest.Mock).mockResolvedValue({
        id: "r1",
        projectId: "p1",
      });
      (prisma.release.update as jest.Mock).mockResolvedValue({
        id: "r1",
        visibility: "PUBLIC",
      });
      (prisma.follow.findMany as jest.Mock).mockResolvedValue([
        {followerId: "f1"},
      ]);

      const caller = releasesRouter.createCaller(ctx);
      const result = await caller.update({
        id: "r1",
        projectId: "p1",
        title: "Updated",
        description: "D",
        content: "C",
        status: "PRODUCTION",
        visibility: "PUBLIC",
      });

      expect(prisma.release.update).toHaveBeenCalled();
      expect(prisma.notification.createMany).toHaveBeenCalled();
      expect(result.id).toBe("r1");
    });

    it("throws error if release does not exist", async () => {
      (prisma.release.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = releasesRouter.createCaller(ctx);

      await expect(
        caller.update({
          id: "r1",
          projectId: "p1",
          title: "Updated",
          description: "D",
          content: "C",
          status: "PRODUCTION",
          visibility: "PUBLIC",
        })
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        })
      );
    });

    it("does not send notifications when visibility is not public", async () => {
      (prisma.release.findUnique as jest.Mock).mockResolvedValue({
        id: "r1",
        projectId: "p1",
      });
      (prisma.release.update as jest.Mock).mockResolvedValue({
        id: "r1",
        visibility: "PRIVATE",
      });

      const caller = releasesRouter.createCaller(ctx);
      const result = await caller.update({
        id: "r1",
        projectId: "p1",
        title: "Updated",
        description: "D",
        content: "C",
        status: "PRODUCTION",
        visibility: "PRIVATE",
      });

      expect(prisma.release.update).toHaveBeenCalled();
      expect(prisma.notification.createMany).not.toHaveBeenCalled();
      expect(result.id).toBe("r1");
    });
  });

  describe("removeImage", () => {
    it("removes image when release exists", async () => {
      (prisma.release.findUnique as jest.Mock).mockResolvedValue({id: "r1"});

      const caller = releasesRouter.createCaller(ctx);
      const result = await caller.removeImage({id: "r1", imageId: "img1"});

      expect(prisma.image.delete).toHaveBeenCalledWith({
        where: {id: "img1", target: "RELEASE", targetId: "r1"},
      });
      expect(result.id).toBe("r1");
    });

    it("throws error if release does not exist", async () => {
      (prisma.release.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = releasesRouter.createCaller(ctx);

      await expect(
        caller.removeImage({id: "r1", imageId: "img1"})
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Release does not exist.",
        })
      );
    });
  });

  describe("remove", () => {
    it("deletes a release if owner", async () => {
      (prisma.release.delete as jest.Mock).mockResolvedValue({id: "r1"});

      const caller = releasesRouter.createCaller(ctx);
      const result = await caller.remove({id: "r1"});

      expect(prisma.release.delete).toHaveBeenCalled();
      expect(result.id).toBe("r1");
    });

    it("throws error if release does not exist", async () => {
      (prisma.release.delete as jest.Mock).mockResolvedValue(null);

      const caller = releasesRouter.createCaller(ctx);

      await expect(caller.remove({id: "r1"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        })
      );
    });
  });

  describe("getOne", () => {
    it("throws error if release not found", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue(null);

      const caller = releasesRouter.createCaller(ctx);

      await expect(caller.getOne({id: "r1"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        })
      );
    });

    it("throws error if non-owner and public release not found", async () => {
      (prisma.release.findFirst as jest.Mock)
        .mockResolvedValueOnce({
          id: "r1",
          project: {ownerId: "other"},
        })
        .mockResolvedValueOnce(null);

      const caller = releasesRouter.createCaller(ctx);

      await expect(caller.getOne({id: "r1"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        })
      );
    });

    it("throws error if owner and release details not found", async () => {
      (prisma.release.findFirst as jest.Mock)
        .mockResolvedValueOnce({
          id: "r1",
          project: {ownerId: "u1"},
        })
        .mockResolvedValueOnce(null);

      const caller = releasesRouter.createCaller(ctx);

      await expect(caller.getOne({id: "r1"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        })
      );
    });

    it("returns release data for non-owner when release is public", async () => {
      (prisma.release.findFirst as jest.Mock)
        .mockResolvedValueOnce({
          id: "r1",
          project: {ownerId: "other"},
        })
        .mockResolvedValueOnce({
          id: "r1",
          projectId: "p1",
          _count: {comments: 1, reviews: 2},
        });
      (prisma.view.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.view.create as jest.Mock).mockResolvedValue({id: "v1"});
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([
        {type: "UP", _count: 1},
      ]);
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue({id: "vote1"});
      (prisma.view.count as jest.Mock).mockResolvedValue(10);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _count: {id: 2},
        _avg: {rating: 4.5},
      });
      (prisma.image.findMany as jest.Mock).mockResolvedValue([{id: "img1"}]);

      const caller = releasesRouter.createCaller(ctx);
      const result = await caller.getOne({id: "r1"});

      expect(result.id).toBe("r1");
      expect(result.isOwner).toBe(false);
      expect(result.votes).toHaveLength(1);
      expect(result.myVote).toEqual({id: "vote1"});
      expect(result.views).toBe(10);
      expect(result.reviewStats._count.id).toBe(2);
      expect(result.images).toHaveLength(1);
      expect(prisma.view.create).toHaveBeenCalled();
    });

    it("returns release data for owner", async () => {
      (prisma.release.findFirst as jest.Mock)
        .mockResolvedValueOnce({
          id: "r1",
          project: {ownerId: "u1"},
        })
        .mockResolvedValueOnce({
          id: "r1",
          projectId: "p1",
          _count: {comments: 1, reviews: 2},
        });
      (prisma.view.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.view.create as jest.Mock).mockResolvedValue({id: "v1"});
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([
        {type: "UP", _count: 1},
      ]);
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue({id: "vote1"});
      (prisma.view.count as jest.Mock).mockResolvedValue(5);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _count: {id: 3},
        _avg: {rating: 4},
      });
      (prisma.image.findMany as jest.Mock).mockResolvedValue([{id: "img1"}]);

      const caller = releasesRouter.createCaller(ctx);
      const result = await caller.getOne({id: "r1"});

      expect(result.id).toBe("r1");
      expect(result.isOwner).toBe(true);
      expect(result.votes).toHaveLength(1);
      expect(result.myVote).toEqual({id: "vote1"});
      expect(result.views).toBe(5);
      expect(result.reviewStats._count.id).toBe(3);
      expect(result.images).toHaveLength(1);
      expect(prisma.view.create).toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    const baseInput = {
      projectId: "p1",
      page: 1,
      pageSize: 10,
      search: "",
    };

    it("throws error if project does not exist", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue(null);

      const caller = releasesRouter.createCaller(ctx);

      await expect(caller.getAll(baseInput)).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This project does not exists.",
        })
      );
    });

    it("returns paginated releases for project owner", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue({
        id: "p1",
        ownerId: "u1",
      });
      (prisma.release.findMany as jest.Mock).mockResolvedValue([
        {
          id: "r1",
          projectId: "p1",
          _count: {comments: 1, reviews: 2},
        },
      ]);
      (prisma.release.count as jest.Mock).mockResolvedValue(1);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([
        {type: "UP", _count: 1},
      ]);
      (prisma.view.count as jest.Mock).mockResolvedValue(5);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _count: {id: 2},
        _avg: {rating: 4.5},
      });
      (prisma.image.findMany as jest.Mock).mockResolvedValue([{id: "img1"}]);

      const caller = releasesRouter.createCaller(ctx);
      const result = await caller.getAll(baseInput);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].isOwner).toBe(true);
      expect(result.items[0].votes).toHaveLength(1);
      expect(result.items[0].views).toBe(5);
      expect(result.items[0].reviewStats._count.id).toBe(2);
      expect(result.items[0].images).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });

    it("applies visibility and search filters for non-owner", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue({
        id: "p1",
        ownerId: "other",
      });
      (prisma.release.findMany as jest.Mock).mockResolvedValue([
        {
          id: "r1",
          projectId: "p1",
          _count: {comments: 0, reviews: 0},
        },
      ]);
      (prisma.release.count as jest.Mock).mockResolvedValue(1);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);
      (prisma.view.count as jest.Mock).mockResolvedValue(0);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _count: {id: 0},
        _avg: {rating: null},
      });
      (prisma.image.findMany as jest.Mock).mockResolvedValue([]);

      const caller = releasesRouter.createCaller(ctx);
      const result = await caller.getAll({
        ...baseInput,
        search: "test",
      });

      expect(prisma.release.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: expect.arrayContaining([
              expect.objectContaining({projectId: "p1"}),
              expect.objectContaining({
                title: expect.objectContaining({contains: "test"}),
              }),
              expect.objectContaining({visibility: "PUBLIC"}),
            ]),
          },
        })
      );

      expect(result.items).toHaveLength(1);
      expect(result.items[0].isOwner).toBe(false);
      expect(result.items[0].votes).toHaveLength(0);
      expect(result.items[0].views).toBe(0);
      expect(result.items[0].images).toHaveLength(0);
    });
  });
});
