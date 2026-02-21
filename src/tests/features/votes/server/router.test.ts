import {headers} from "next/headers";
import {TRPCError} from "@trpc/server";

import {createCallerFactory} from "@/trpc/init";
import prisma from "@/lib/db";
import {auth} from "@/lib/auth/auth";
import {votesRouter} from "@/features/votes/server/router";

describe("votesRouter", () => {
  const createCaller = createCallerFactory(votesRouter);
  const mockContext = {
    auth: {
      user: {id: "user-1", role: "user"},
      session: {id: "sess-1"},
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const caller = createCaller(mockContext as any);

  beforeEach(() => {
    jest.clearAllMocks();
    (headers as unknown as jest.Mock).mockResolvedValue({});
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(
      mockContext.auth
    );
  });

  describe("create mutation", () => {
    it("throws error if user cannot vote", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        caller.create({
          target: "PROJECT",
          targetId: "proj-1",
          type: "UP",
        })
      ).rejects.toThrow(TRPCError);
    });

    it("throws error if user cannot vote on RELEASE", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        caller.create({
          target: "RELEASE",
          targetId: "rel-1",
          type: "UP",
        })
      ).rejects.toThrow(TRPCError);
    });

    it("throws error if user cannot vote on COMMENT", async () => {
      (prisma.comment.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        caller.create({
          target: "COMMENT",
          targetId: "comm-1",
          type: "UP",
        })
      ).rejects.toThrow(TRPCError);
    });

    it("throws error if user cannot vote on REVIEW", async () => {
      (prisma.review.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        caller.create({
          target: "REVIEW",
          targetId: "rev-1",
          type: "UP",
        })
      ).rejects.toThrow(TRPCError);
    });

    it("deletes vote if existing vote has same type", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue({id: "proj-1"});
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue({
        id: "vote-1",
        type: "UP",
      });

      const result = await caller.create({
        target: "PROJECT",
        targetId: "proj-1",
        type: "UP",
      });

      expect(prisma.vote.delete).toHaveBeenCalledWith({
        where: {id: "vote-1"},
      });
      expect(result.id).toBe("vote-1");
    });

    it("updates vote if existing vote has different type", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue({id: "proj-1"});
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue({
        id: "vote-1",
        type: "DOWN",
      });

      const result = await caller.create({
        target: "PROJECT",
        targetId: "proj-1",
        type: "UP",
      });

      expect(prisma.vote.update).toHaveBeenCalledWith({
        where: {id: "vote-1"},
        data: {type: "UP"},
      });
      expect(result.id).toBe("vote-1");
    });

    it("creates new vote if no existing vote", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue({id: "proj-1"});
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.vote.create as jest.Mock).mockResolvedValue({
        id: "new-vote-1",
        type: "UP",
      });

      const result = await caller.create({
        target: "PROJECT",
        targetId: "proj-1",
        type: "UP",
      });

      expect(prisma.vote.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          target: "PROJECT",
          targetId: "proj-1",
          type: "UP",
        },
      });
      expect(result.id).toBe("new-vote-1");
    });

    it("handles RELEASE target", async () => {
      (prisma.release.findFirst as jest.Mock).mockResolvedValue({id: "rel-1"});
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.vote.create as jest.Mock).mockResolvedValue({id: "v-1"});

      await caller.create({target: "RELEASE", targetId: "rel-1", type: "UP"});
      expect(prisma.release.findFirst).toHaveBeenCalled();
    });

    it("handles COMMENT target", async () => {
      (prisma.comment.findFirst as jest.Mock).mockResolvedValue({id: "comm-1"});
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.vote.create as jest.Mock).mockResolvedValue({id: "v-1"});

      await caller.create({target: "COMMENT", targetId: "comm-1", type: "UP"});
      expect(prisma.comment.findFirst).toHaveBeenCalled();
    });

    it("handles REVIEW target", async () => {
      (prisma.review.findFirst as jest.Mock).mockResolvedValue({id: "rev-1"});
      (prisma.vote.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.vote.create as jest.Mock).mockResolvedValue({id: "v-1"});

      await caller.create({target: "REVIEW", targetId: "rev-1", type: "UP"});
      expect(prisma.review.findFirst).toHaveBeenCalled();
    });
  });
});
