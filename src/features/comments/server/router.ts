import {TRPCError} from "@trpc/server";
import z from "zod";

import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import prisma from "@/lib/db";
import {PAGINATION} from "@/constants/pagination";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        releaseId: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({input, ctx}) => {
      const {releaseId, body} = input;

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

      const comment = await prisma.comment.create({
        data: {
          body,
          authorId: ctx.auth.user.id,
          releaseId,
        },
      });

      await prisma.notification.create({
        data: {
          type: "COMMENT",
          recipientId: release.project.ownerId,
          actorId: ctx.auth.user.id,
          target: "COMMENT",
          targetId: comment.id,
          title: "New comment",
          body: `${ctx.auth.user.name} commented on your release`,
          url: `/project/details/${release.project.id}/release/${release.id}`,
        },
      });

      return comment;
    }),
  reply: protectedProcedure
    .input(
      z.object({
        releaseId: z.string(),
        commentId: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({input, ctx}) => {
      const {releaseId, commentId, body} = input;

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

      const parent = await prisma.comment.findFirst({
        where: {
          id: commentId,
          releaseId,
          release: {
            project: {
              OR: [{ownerId: ctx.auth.user.id}, {visibility: "PUBLIC"}],
            },
          },
        },
        include: {author: {select: {id: true}}},
      });
      if (!parent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This comment does not exists.",
        });
      }

      const comment = await prisma.comment.create({
        data: {
          body,
          authorId: ctx.auth.user.id,
          releaseId,
          parentId: commentId,
        },
      });

      await prisma.notification.create({
        data: {
          type: "COMMENT",
          recipientId: release.project.ownerId,
          actorId: ctx.auth.user.id,
          target: "COMMENT",
          targetId: comment.id,
          title: "New comment",
          body: `${ctx.auth.user.name} commented on your release`,
          url: `/project/details/${release.project.id}/release/${release.id}`,
        },
      });

      await prisma.notification.create({
        data: {
          type: "REPLY",
          recipientId: parent.author.id,
          actorId: ctx.auth.user.id,
          target: "COMMENT",
          targetId: comment.id,
          title: "New reply",
          body: `${ctx.auth.user.name} replied to your comment`,
          url: `/project/details/${release.project.id}/release/${release.id}`,
        },
      });

      return comment;
    }),
  remove: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input, ctx}) => {
      const comment = await prisma.comment.update({
        where: {
          id: input.id,
          authorId: ctx.auth.user.id,
        },
        data: {
          body: "[deleted]",
          deletedAt: new Date(),
        },
      });

      if (!comment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This comment does not exists.",
        });
      }

      return comment;
    }),
  getOne: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({input, ctx}) => {
      const comment = await prisma.comment.findFirst({
        where: {id: input.id},
        select: {id: true},
      });

      if (!comment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This comment does not exists.",
        });
      }

      const votes = await prisma.vote.groupBy({
        by: ["type"],
        where: {target: "COMMENT", targetId: input.id},
        _count: true,
      });

      const myVote = await prisma.vote.findUnique({
        where: {
          userId_target_targetId: {
            userId: ctx.auth.user.id,
            target: "COMMENT",
            targetId: input.id,
          },
        },
      });

      return {...comment, votes, myVote};
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
        prisma.comment.findMany({
          where: {
            releaseId,
            parentId: null,
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
            replies: {
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
            },
          },
        }),
        prisma.comment.count({
          where: {
            releaseId,
            parentId: null,
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
            where: {target: "COMMENT", targetId: item.id},
            _count: true,
          });

          const myVote = await prisma.vote.findUnique({
            where: {
              userId_target_targetId: {
                userId: ctx.auth.user.id,
                target: "COMMENT",
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
        prisma.comment.findMany({
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
            replies: {
              orderBy: {createdAt: "desc"},
              select: {id: true},
            },
          },
        }),
        prisma.comment.count({
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
            where: {target: "COMMENT", targetId: item.id},
            _count: true,
          });

          return {...item, votes};
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
