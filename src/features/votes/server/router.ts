import {TRPCError} from "@trpc/server";
import z from "zod";

import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import prisma from "@/lib/db";

export async function canVote({
  userId,
  target,
  targetId,
}: {
  userId: string;
  target: "PROJECT" | "RELEASE" | "COMMENT" | "REVIEW";
  targetId: string;
}) {
  switch (target) {
    case "PROJECT":
      return prisma.project.findFirst({
        where: {
          id: targetId,
          OR: [{ownerId: userId}, {visibility: "PUBLIC"}],
        },
        select: {id: true},
      });

    case "RELEASE":
      return prisma.release.findFirst({
        where: {
          id: targetId,
          project: {
            OR: [{ownerId: userId}, {visibility: "PUBLIC"}],
          },
        },
        select: {id: true},
      });

    case "COMMENT":
      return prisma.comment.findFirst({
        where: {
          id: targetId,
          release: {
            project: {
              OR: [{ownerId: userId}, {visibility: "PUBLIC"}],
            },
          },
        },
        select: {id: true},
      });

    case "REVIEW":
      return prisma.review.findFirst({
        where: {
          id: targetId,
          release: {
            project: {
              OR: [{ownerId: userId}, {visibility: "PUBLIC"}],
            },
          },
        },
        select: {id: true},
      });
  }
}

export const votesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        target: z.enum(["PROJECT", "RELEASE", "COMMENT", "REVIEW"]),
        targetId: z.string(),
        type: z.enum(["UP", "DOWN"]),
      })
    )
    .mutation(async ({input, ctx}) => {
      const {target, targetId, type} = input;

      const vote = await canVote({userId: ctx.auth.user.id, target, targetId});
      if (!vote) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't vote on this.",
        });
      }

      return prisma.$transaction(async (tx) => {
        const existing = await tx.vote.findUnique({
          where: {
            userId_target_targetId: {
              userId: ctx.auth.user.id,
              target,
              targetId,
            },
          },
        });

        if (existing && existing.type === type) {
          await tx.vote.delete({
            where: {
              id: existing.id,
            },
          });
          return existing;
        }

        if (existing) {
          await tx.vote.update({
            where: {
              id: existing.id,
            },
            data: {type},
          });
          return existing;
        }

        const newVote = await tx.vote.create({
          data: {
            userId: ctx.auth.user.id,
            target,
            targetId,
            type,
          },
        });

        return newVote;
      });
    }),
});
