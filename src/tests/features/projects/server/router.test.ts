import {TRPCError} from "@trpc/server";

import prisma from "@/lib/db";
import {auth} from "@/lib/auth/auth";
import {polarClient} from "@/lib/polar";
import {projectsRouter} from "@/features/projects/server/router";

describe("projectsRouter", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx: any = {
    auth: {
      user: {id: "u1", name: "User 1", role: "premium"},
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminCtx: any = {
    auth: {
      user: {id: "admin-1", name: "Admin", role: "admin"},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth.api.getSession as unknown as jest.Mock)
      .mockResolvedValueOnce({
        user: {id: "u1", name: "User 1", role: "premium"},
        session: {id: "s1"},
      })
      .mockResolvedValue({
        user: {id: "admin-1", name: "Admin", role: "admin"},
        session: {id: "s2"},
      });
    (polarClient.customers.getStateExternal as jest.Mock).mockResolvedValue({
      activeSubscriptions: [{id: "sub1"}],
    });
  });

  describe("create", () => {
    it("creates a project with images", async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue({id: "c1"});
      (prisma.project.create as jest.Mock).mockResolvedValue({id: "p1"});

      const caller = projectsRouter.createCaller(ctx);
      const result = await caller.create({
        title: "Test Project",
        description: "Desc",
        content: "Content",
        categoryId: "c1",
        tags: ["tag1"],
        githubUrl: "https://github.com",
        websiteUrl: "https://example.com",
        imageUrl: ["img1.jpg"],
      });

      expect(prisma.project.create).toHaveBeenCalled();
      expect(prisma.image.create).toHaveBeenCalled();
      expect(result.id).toBe("p1");
    });

    it("throws error if category does not exist", async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = projectsRouter.createCaller(ctx);
      await expect(
        caller.create({
          title: "Test",
          description: "D",
          content: "C",
          categoryId: "invalid",
          tags: [],
          githubUrl: "",
          websiteUrl: "",
          imageUrl: [],
        })
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Category does not exist.",
        })
      );
    });
  });

  describe("update", () => {
    it("updates project and sends notifications if public", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: "p1",
        ownerId: "u1",
      });
      (prisma.category.findUnique as jest.Mock).mockResolvedValue({id: "c1"});
      (prisma.project.update as jest.Mock).mockResolvedValue({
        id: "p1",
        visibility: "PUBLIC",
      });
      (prisma.follow.findMany as jest.Mock).mockResolvedValue([
        {followerId: "f1"},
      ]);

      const caller = projectsRouter.createCaller(ctx);
      const result = await caller.update({
        id: "p1",
        title: "Updated",
        description: "D",
        content: "C",
        categoryId: "c1",
        tags: [],
        status: "PRODUCTION",
        visibility: "PUBLIC",
      });

      expect(prisma.project.update).toHaveBeenCalled();
      expect(prisma.notification.createMany).toHaveBeenCalled();
      expect(result.id).toBe("p1");
    });

    it("throws error if project does not exist", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = projectsRouter.createCaller(ctx);

      await expect(
        caller.update({
          id: "p1",
          title: "Updated",
          description: "D",
          content: "C",
          categoryId: "c1",
          tags: [],
          status: "PRODUCTION",
          visibility: "PUBLIC",
        })
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This project does not exists.",
        })
      );
    });

    it("throws error if category does not exist on update", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: "p1",
        ownerId: "u1",
      });
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = projectsRouter.createCaller(ctx);

      await expect(
        caller.update({
          id: "p1",
          title: "Updated",
          description: "D",
          content: "C",
          categoryId: "invalid",
          tags: [],
          status: "PRODUCTION",
          visibility: "PUBLIC",
        })
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Category does not exist.",
        })
      );
    });
  });

  describe("remove", () => {
    it("deletes a project if owner", async () => {
      (prisma.project.deleteMany as jest.Mock).mockResolvedValue({count: 1});

      const caller = projectsRouter.createCaller(ctx);
      const result = await caller.remove({id: "p1"});

      expect(prisma.project.deleteMany).toHaveBeenCalled();
      expect(result.count).toBe(1);
    });

    it("throws error if project not found or not owner", async () => {
      (prisma.project.deleteMany as jest.Mock).mockResolvedValue({count: 0});

      const caller = projectsRouter.createCaller(ctx);
      await expect(caller.remove({id: "p1"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This project does not exists.",
        })
      );
    });
  });

  describe("addImage", () => {
    it("throws error if project does not exist when adding image", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = projectsRouter.createCaller(ctx);

      await expect(
        caller.addImage({id: "p1", imageUrl: ["img1.jpg"]})
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Project does not exist.",
        })
      );
    });
  });

  describe("removeImage", () => {
    it("throws error if project does not exist when removing image", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = projectsRouter.createCaller(ctx);

      await expect(
        caller.removeImage({id: "p1", imageId: "img1"})
      ).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Project does not exist.",
        })
      );
    });
  });

  describe("getOne", () => {
    it("throws error if project does not exist", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = projectsRouter.createCaller(ctx);

      await expect(caller.getOne({id: "p1"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This project does not exists.",
        })
      );
    });

    it("returns project with aggregated data", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: "p1",
        ownerId: "u1",
        releases: [{id: "r1"}],
        _count: {releases: 1},
      });
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([
        {type: "UP", _count: {type: 1}},
      ]);
      (prisma.view.count as jest.Mock).mockResolvedValue(5);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _count: {id: 2},
        _avg: {rating: 4.5},
      });
      (prisma.image.findMany as jest.Mock).mockResolvedValue([
        {id: "img1", url: "img1.jpg"},
      ]);

      const caller = projectsRouter.createCaller(ctx);
      const result = await caller.getOne({id: "p1"});

      expect(result.id).toBe("p1");
      expect(result.images).toHaveLength(1);
    });
  });

  describe("getAll", () => {
    const baseInput = {
      page: 1,
      pageSize: 10,
      search: "",
      category: "",
    };

    it("returns paginated projects with aggregates", async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.project.findMany as jest.Mock).mockResolvedValue([
        {
          id: "p1",
          releases: [{id: "r1"}],
        },
      ]);
      (prisma.project.count as jest.Mock).mockResolvedValue(1);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);
      (prisma.view.count as jest.Mock).mockResolvedValue(0);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _count: {id: 0},
        _avg: {rating: null},
      });
      (prisma.image.findMany as jest.Mock).mockResolvedValue([]);

      const caller = projectsRouter.createCaller(adminCtx);
      const result = await caller.getAll(baseInput);

      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });
  });

  describe("getPublic", () => {
    const baseInput = {
      page: 1,
      pageSize: 10,
      search: "",
      category: "",
    };

    it("returns paginated public projects with aggregates", async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.project.findMany as jest.Mock).mockResolvedValue([
        {
          id: "p1",
          releases: [{id: "r1"}],
        },
      ]);
      (prisma.project.count as jest.Mock).mockResolvedValue(1);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);
      (prisma.view.count as jest.Mock).mockResolvedValue(0);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _count: {id: 0},
        _avg: {rating: null},
      });
      (prisma.image.findMany as jest.Mock).mockResolvedValue([]);

      const caller = projectsRouter.createCaller(ctx);
      const result = await caller.getPublic(baseInput);

      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });
  });

  describe("getMyAll", () => {
    const baseInput = {
      page: 1,
      pageSize: 10,
      search: "",
      category: "",
    };

    it("returns paginated projects for current user with aggregates", async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.project.findMany as jest.Mock).mockResolvedValue([
        {
          id: "p1",
          releases: [{id: "r1"}],
        },
      ]);
      (prisma.project.count as jest.Mock).mockResolvedValue(1);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);
      (prisma.view.count as jest.Mock).mockResolvedValue(0);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _count: {id: 0},
        _avg: {rating: null},
      });
      (prisma.image.findMany as jest.Mock).mockResolvedValue([]);

      const caller = projectsRouter.createCaller(ctx);
      const result = await caller.getMyAll(baseInput);

      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });
  });

  describe("getUserAll", () => {
    const baseInput = {
      userId: "u2",
      page: 1,
      pageSize: 10,
      search: "",
      category: "",
    };

    it("returns paginated public projects for user with aggregates", async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.project.findMany as jest.Mock).mockResolvedValue([
        {
          id: "p1",
          releases: [{id: "r1"}],
        },
      ]);
      (prisma.project.count as jest.Mock).mockResolvedValue(1);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);
      (prisma.view.count as jest.Mock).mockResolvedValue(0);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _count: {id: 0},
        _avg: {rating: null},
      });
      (prisma.image.findMany as jest.Mock).mockResolvedValue([]);

      const caller = projectsRouter.createCaller(ctx);
      const result = await caller.getUserAll(baseInput);

      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });
  });

  describe("view", () => {
    it("throws error if project does not exist", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = projectsRouter.createCaller(ctx);

      await expect(caller.view({id: "p1"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "This project does not exists.",
        })
      );
    });

    it("returns project view data when found", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: "p1",
        ownerId: "owner-1",
        releases: [{id: "r1"}],
        _count: {releases: 1},
      });
      (prisma.view.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.view.create as jest.Mock).mockResolvedValue({id: "v1"});
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([]);
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.view.count as jest.Mock).mockResolvedValue(0);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _count: {id: 0},
        _avg: {rating: null},
      });
      (prisma.image.findMany as jest.Mock).mockResolvedValue([]);

      const caller = projectsRouter.createCaller(ctx);
      const result = await caller.view({id: "p1"});

      expect(result.id).toBe("p1");
      expect(result.images).toHaveLength(0);
    });
  });
});
