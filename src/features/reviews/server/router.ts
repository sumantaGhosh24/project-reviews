import {TRPCError} from "@trpc/server";
import z from "zod";

import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import prisma from "@/lib/db";
import {PAGINATION} from "@/constants/pagination";

export const reviewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        releaseId: z.string(),
        rating: z.number().min(1).max(5),
        feedback: z.string(),
      })
    )
    .mutation(async ({input, ctx}) => {
      const {releaseId, rating, feedback} = input;

      const release = await prisma.release.findFirst({
        where: {id: releaseId},
        include: {project: {select: {id: true, ownerId: true}}},
      });
      if (!release) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        });
      }

      const exists = await prisma.review.findFirst({
        where: {
          releaseId,
          authorId: ctx.auth.user.id,
        },
      });
      if (exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have a review on this release.",
        });
      }

      const review = await prisma.review.create({
        data: {
          rating,
          feedback,
          authorId: ctx.auth.user.id,
          releaseId,
        },
      });

      await prisma.notification.create({
        data: {
          type: "REVIEW",
          recipientId: release.project.ownerId,
          actorId: ctx.auth.user.id,
          target: "REVIEW",
          targetId: review.id,
          title: "New review",
          body: `${ctx.auth.user.name} post a review on your release`,
          url: `/project/details/${release.project.id}/release/${release.id}`,
        },
      });

      return review;
    }),
  remove: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input, ctx}) => {
      const review = await prisma.review.delete({
        where: {
          id: input.id,
          authorId: ctx.auth.user.id,
        },
      });

      if (!review) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This review does not exists.",
        });
      }

      return review;
    }),
  getOne: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({input, ctx}) => {
      const review = await prisma.review.findFirst({
        where: {id: input.id},
        select: {id: true},
      });

      if (!review) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This review does not exists.",
        });
      }

      const votes = await prisma.vote.groupBy({
        by: ["type"],
        where: {target: "REVIEW", targetId: input.id},
        _count: true,
      });

      const myVote = await prisma.vote.findUnique({
        where: {
          userId_target_targetId: {
            userId: ctx.auth.user.id,
            target: "REVIEW",
            targetId: input.id,
          },
        },
      });

      return {...review, votes, myVote};
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        releaseId: z.string(),
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
      })
    )
    .query(async ({input, ctx}) => {
      const {releaseId, page, pageSize} = input;

      const release = await prisma.release.findFirst({
        where: {id: releaseId},
        select: {id: true},
      });

      if (!release) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        });
      }

      const [items, totalCount] = await Promise.all([
        prisma.review.findMany({
          where: {
            releaseId,
            release: {
              project: {
                OR: [{ownerId: ctx.auth.user.id}, {visibility: "PUBLIC"}],
              },
            },
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        }),
        prisma.review.count({
          where: {
            releaseId,
            release: {
              project: {
                OR: [{ownerId: ctx.auth.user.id}, {visibility: "PUBLIC"}],
              },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const itemsWithVote = await Promise.all(
        items.map(async (item) => {
          const votes = await prisma.vote.groupBy({
            by: ["type"],
            where: {target: "REVIEW", targetId: item.id},
            _count: true,
          });

          const myVote = await prisma.vote.findUnique({
            where: {
              userId_target_targetId: {
                userId: ctx.auth.user.id,
                target: "REVIEW",
                targetId: item.id,
              },
            },
          });

          const isOwner = item.authorId === ctx.auth.user.id;

          return {...item, isOwner, votes, myVote};
        })
      );

      return {
        items: itemsWithVote,
        totalCount,
        page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
  getMyAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
      })
    )
    .query(async ({input, ctx}) => {
      const {page, pageSize} = input;

      const [items, totalCount] = await Promise.all([
        prisma.review.findMany({
          where: {
            authorId: ctx.auth.user.id,
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            release: {
              select: {
                id: true,
                project: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        }),
        prisma.review.count({
          where: {
            authorId: ctx.auth.user.id,
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const itemsWithVote = await Promise.all(
        items.map(async (item) => {
          const votes = await prisma.vote.groupBy({
            by: ["type"],
            where: {target: "REVIEW", targetId: item.id},
            _count: true,
          });

          const isOwner = item.authorId === ctx.auth.user.id;

          return {...item, isOwner, votes};
        })
      );

      return {
        items: itemsWithVote,
        totalCount,
        page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
