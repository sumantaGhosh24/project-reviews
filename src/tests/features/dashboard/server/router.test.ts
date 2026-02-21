/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {TRPCError} from "@trpc/server";

import prisma from "@/lib/db";
import {auth} from "@/lib/auth/auth";
import {dashboardRouter} from "@/features/dashboard/server/router";

describe("dashboardRouter", () => {
  const ctx: any = {
    auth: {
      user: {id: "u1", role: "admin"},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
      user: {id: "u1", role: "admin"},
      session: {id: "s1"},
    });
  });

  describe("getDashboard", () => {
    it("returns user dashboard data", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "u1",
        name: "User 1",
        _count: {
          projects: 1,
          comments: 2,
          reviews: 3,
          followers: 4,
          following: 5,
        },
      });
      (prisma.vote.count as jest.Mock).mockResolvedValue(10);
      (prisma.view.count as jest.Mock).mockResolvedValue(20);
      (prisma.project.findMany as jest.Mock).mockResolvedValue([{id: "p1"}]);
      (prisma.release.findMany as jest.Mock).mockResolvedValue([{id: "r1"}]);
      (prisma.notification.count as jest.Mock).mockResolvedValue(5);

      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getDashboard();

      expect(result.id).toBe("u1");
      expect(result.counts.projects).toBe(1);
      expect(result.counts.votesGiven).toBe(10);
      expect(result.engagement.votesReceived).toBe(10);
      expect(result.notifications.unread).toBe(5);
    });

    it("throws error if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = dashboardRouter.createCaller(ctx);
      await expect(caller.getDashboard()).rejects.toThrow(
        new TRPCError({code: "BAD_REQUEST", message: "User not found."})
      );
    });
  });

  describe("getAdminDashboard", () => {
    it("returns admin dashboard data if user is admin", async () => {
      (prisma.user.count as jest.Mock).mockResolvedValue(100);
      (prisma.category.count as jest.Mock).mockResolvedValue(10);
      (prisma.project.count as jest.Mock).mockResolvedValue(50);
      (prisma.release.count as jest.Mock).mockResolvedValue(30);
      (prisma.comment.count as jest.Mock).mockResolvedValue(20);
      (prisma.review.count as jest.Mock).mockResolvedValue(15);
      (prisma.vote.count as jest.Mock).mockResolvedValue(80);
      (prisma.view.count as jest.Mock).mockResolvedValue(200);
      (prisma.notification.count as jest.Mock).mockResolvedValue(100);

      const caller = dashboardRouter.createCaller(ctx);
      const result = (await caller.getAdminDashboard()) as any;

      expect(result.unauthorized).toBeUndefined();
      expect(result.user.total).toBe(100);
      expect(result.category.total).toBe(10);
    });

    it("returns unauthorized if user is not admin", async () => {
      const nonAdminCtx = {
        auth: {
          user: {id: "u1", role: "user"},
        },
      };
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
        user: {id: "u1", role: "user"},
        session: {id: "s1"},
      });
      const caller = dashboardRouter.createCaller(nonAdminCtx);
      const result = (await caller.getAdminDashboard()) as any;

      expect(result.unauthorized).toBe(true);
    });
  });

  describe("getProjectDashboard", () => {
    it("throws error if project not found", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = dashboardRouter.createCaller(ctx);
      await expect(
        caller.getProjectDashboard({projectId: "p1"})
      ).rejects.toThrow(
        new TRPCError({code: "BAD_REQUEST", message: "Project not found."})
      );
    });

    it("returns unauthorized if user is not project owner", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: "p1",
        title: "Project 1",
        description: "Desc",
        status: "DRAFT",
        visibility: "PRIVATE",
        category: {id: "c1", name: "Cat"},
        owner: {id: "other"},
        _count: {releases: 0},
      });

      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getProjectDashboard({projectId: "p1"});

      expect(result).toEqual({unauthorized: true});
    });

    it("returns project dashboard data when authorized", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: "p1",
        title: "Project 1",
        description: "Desc",
        status: "DRAFT",
        visibility: "PRIVATE",
        category: {id: "c1", name: "Cat"},
        owner: {id: "u1"},
        _count: {releases: 2},
      });
      (prisma.vote.count as jest.Mock)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(7);
      (prisma.view.count as jest.Mock)
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(20);
      (prisma.release.findMany as jest.Mock).mockResolvedValue([
        {id: "r1"},
        {id: "r2"},
      ]);
      (prisma.review as any).aggregate = jest.fn().mockResolvedValue({
        _count: {id: 3},
        _avg: {rating: 4.5},
      });
      (prisma.comment.count as jest.Mock).mockResolvedValue(8);

      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getProjectDashboard({projectId: "p1"});

      // @ts-expect-error
      expect(result.project.id).toBe("p1");
      // @ts-expect-error
      expect(result.counts.releases).toBe(2);
      // @ts-expect-error
      expect(result.counts.comments).toBe(8);
      // @ts-expect-error
      expect(result.counts.reviews).toBe(3);
      // @ts-expect-error
      expect(result.engagement.project.votes).toBe(5);
      // @ts-expect-error
      expect(result.engagement.project.views).toBe(10);
      // @ts-expect-error
      expect(result.engagement.releases.votes).toBe(7);
      // @ts-expect-error
      expect(result.engagement.releases.views).toBe(20);
      // @ts-expect-error
      expect(result.ratings.average).toBe(4.5);
      // @ts-expect-error
      expect(result.ratings.total).toBe(3);
    });
  });

  describe("getReleaseDashboard", () => {
    it("throws error if release not found", async () => {
      (prisma.release.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = dashboardRouter.createCaller(ctx);
      await expect(
        caller.getReleaseDashboard({releaseId: "r1"})
      ).rejects.toThrow(
        new TRPCError({code: "BAD_REQUEST", message: "Release not found."})
      );
    });

    it("returns unauthorized if user is not release owner", async () => {
      (prisma.release.findUnique as jest.Mock).mockResolvedValue({
        id: "r1",
        title: "Release 1",
        description: "Desc",
        status: "DRAFT",
        visibility: "PRIVATE",
        project: {id: "p1", owner: {id: "other"}},
      });

      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getReleaseDashboard({releaseId: "r1"});

      expect(result).toEqual({unauthorized: true});
    });

    it("returns release dashboard data when authorized", async () => {
      (prisma.release.findUnique as jest.Mock).mockResolvedValue({
        id: "r1",
        title: "Release 1",
        description: "Desc",
        status: "DRAFT",
        visibility: "PRIVATE",
        project: {id: "p1", owner: {id: "u1"}},
      });
      (prisma.vote.count as jest.Mock).mockResolvedValue(5);
      (prisma.view.count as jest.Mock).mockResolvedValue(10);
      (prisma.review as any).aggregate = jest.fn().mockResolvedValue({
        _count: {id: 4},
        _avg: {rating: 3.5},
      });
      (prisma.review as any).groupBy = jest.fn().mockResolvedValue([
        {rating: 3, _count: {rating: 1}},
        {rating: 4, _count: {rating: 3}},
      ]);
      (prisma.comment.count as jest.Mock)
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(2);
      (prisma.vote.groupBy as jest.Mock).mockResolvedValue([
        {type: "UP", _count: {type: 5}},
        {type: "DOWN", _count: {type: 1}},
      ]);

      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getReleaseDashboard({releaseId: "r1"});

      // @ts-expect-error
      expect(result.release.id).toBe("r1");
      // @ts-expect-error
      expect(result.counts.comments).toBe(6);
      // @ts-expect-error
      expect(result.counts.replies).toBe(2);
      // @ts-expect-error
      expect(result.counts.reviews).toBe(4);
      // @ts-expect-error
      expect(result.engagement.votes).toBe(5);
      // @ts-expect-error
      expect(result.engagement.views).toBe(10);
      // @ts-expect-error
      expect(result.ratings.average).toBe(3.5);
      // @ts-expect-error
      expect(result.ratings.total).toBe(4);
      // @ts-expect-error
      expect(result.votes.breakdown).toHaveLength(2);
    });
  });
});
