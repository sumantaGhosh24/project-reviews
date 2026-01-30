import {TRPCError} from "@trpc/server";
import z from "zod";

import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db";
import {PAGINATION} from "@/constants/pagination";

export const releasesRouter = createTRPCRouter({
  create: premiumProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        description: z.string(),
        content: z.string(),
        imageUrl: z.array(z.string()),
      })
    )
    .mutation(async ({input, ctx}) => {
      const {projectId, title, description, content, imageUrl} = input;

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: ctx.auth.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!project)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project does not exists.",
        });

      const release = await prisma.release.create({
        data: {
          title,
          description,
          content,
          project: {
            connect: {id: projectId},
          },
          status: "DRAFT",
          visibility: "PRIVATE",
          publishedAt: null,
        },
      });

      await Promise.all(
        imageUrl.map(async (url) => {
          await prisma.image.create({
            data: {
              target: "RELEASE",
              targetId: release.id,
              url,
            },
          });
        })
      );

      return release;
    }),
  update: premiumProcedure
    .input(
      z.object({
        id: z.string(),
        projectId: z.string(),
        title: z.string(),
        description: z.string(),
        content: z.string(),
        status: z.enum(["DRAFT", "DEVELOPMENT", "PRODUCTION", "DEPRECATED"]),
        visibility: z.enum(["PRIVATE", "PUBLIC", "UNLISTED"]),
      })
    )
    .mutation(async ({input, ctx}) => {
      const {id, projectId, title, description, content, status, visibility} =
        input;

      const release = await prisma.release.findUnique({
        where: {
          id: id,
          project: {
            id: projectId,
            ownerId: ctx.auth.user.id,
          },
        },
      });
      if (!release) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        });
      }

      return prisma.$transaction(async (tx) => {
        const release = await prisma.release.update({
          where: {
            id: id,
            project: {
              id: projectId,
              ownerId: ctx.auth.user.id,
            },
          },
          data: {
            title,
            description,
            content,
            status,
            visibility,
            publishedAt: visibility === "PUBLIC" ? new Date() : null,
          },
        });

        if (release.visibility !== "PUBLIC") return release;

        const followers = await tx.follow.findMany({
          where: {
            followingId: ctx.auth.user.id,
          },
          select: {
            followerId: true,
          },
        });

        if (followers.length === 0) return release;

        await tx.notification.createMany({
          data: followers.map((f) => ({
            type: "RELEASE_PUBLISHED",
            recipientId: f.followerId,
            actorId: ctx.auth.user.id,
            target: "RELEASE",
            targetId: release.id,
            title: "New release published",
            body: `${ctx.auth.user.name} published a new release`,
            url: `/project/details/${release.projectId}/releases/${release.id}`,
          })),
          skipDuplicates: true,
        });

        return release;
      });
    }),
  addImage: premiumProcedure
    .input(
      z.object({
        id: z.string(),
        imageUrl: z.array(z.string()),
      })
    )
    .mutation(async ({input, ctx}) => {
      const {id, imageUrl} = input;

      const release = await prisma.release.findUnique({
        where: {
          id,
          project: {
            ownerId: ctx.auth.user.id,
          },
        },
        select: {id: true},
      });

      if (!release) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Release does not exist.",
        });
      }

      await Promise.all(
        imageUrl.map(async (url) => {
          await prisma.image.create({
            data: {
              target: "RELEASE",
              targetId: release.id,
              url,
            },
          });
        })
      );

      return release;
    }),
  removeImage: premiumProcedure
    .input(
      z.object({
        id: z.string(),
        imageId: z.string(),
      })
    )
    .mutation(async ({input, ctx}) => {
      const {id, imageId} = input;

      const release = await prisma.release.findUnique({
        where: {
          id,
          project: {
            ownerId: ctx.auth.user.id,
          },
        },
        select: {id: true},
      });

      if (!release) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Release does not exist.",
        });
      }

      await prisma.image.delete({
        where: {id: imageId, target: "RELEASE", targetId: release.id},
      });

      return release;
    }),
  remove: premiumProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input, ctx}) => {
      const release = await prisma.release.delete({
        where: {
          id: input.id,
          project: {
            ownerId: ctx.auth.user.id,
          },
        },
      });

      if (!release) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        });
      }

      return release;
    }),
  getOne: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({input, ctx}) => {
      const release = await prisma.release.findFirst({
        where: {id: input.id},
        include: {project: {select: {ownerId: true}}},
      });
      if (!release) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This release does not exists.",
        });
      }

      const isOwner = release.project.ownerId === ctx.auth.user.id;

      if (release.project.ownerId !== ctx.auth.user.id) {
        const release = await prisma.release.findFirst({
          where: {id: input.id, visibility: "PUBLIC"},
          include: {
            _count: {
              select: {
                comments: true,
                reviews: true,
              },
            },
          },
        });

        if (!release) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This release does not exists.",
          });
        }

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const isUniqueView = await prisma.view.findFirst({
          where: {
            target: "RELEASE",
            targetId: input.id,
            createdAt: {gte: since},
            viewerId: ctx.auth.user.id,
          },
          select: {id: true},
        });

        if (!isUniqueView) {
          await prisma.view.create({
            data: {
              target: "RELEASE",
              targetId: input.id,
              viewerId: ctx.auth.user.id,
            },
          });
        }

        const votes = await prisma.vote.groupBy({
          by: ["type"],
          where: {target: "RELEASE", targetId: input.id},
          _count: true,
        });

        const myVote = await prisma.vote.findUnique({
          where: {
            userId_target_targetId: {
              userId: ctx.auth.user.id,
              target: "RELEASE",
              targetId: input.id,
            },
          },
        });

        const views = await prisma.view.count({
          where: {target: "RELEASE", targetId: input.id},
        });

        const reviewStats = await prisma.review.aggregate({
          where: {
            releaseId: input.id,
          },
          _count: {id: true},
          _avg: {rating: true},
        });

        const images = await prisma.image.findMany({
          where: {target: "RELEASE", targetId: release.id},
        });

        return {...release, isOwner, votes, myVote, views, reviewStats, images};
      } else {
        const release = await prisma.release.findFirst({
          where: {id: input.id},
          include: {
            _count: {
              select: {
                comments: true,
                reviews: true,
              },
            },
          },
        });

        if (!release) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This release does not exists.",
          });
        }

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const isUniqueView = await prisma.view.findFirst({
          where: {
            target: "RELEASE",
            targetId: input.id,
            createdAt: {gte: since},
            viewerId: ctx.auth.user.id,
          },
          select: {id: true},
        });

        if (!isUniqueView) {
          await prisma.view.create({
            data: {
              target: "RELEASE",
              targetId: input.id,
              viewerId: ctx.auth.user.id,
            },
          });
        }

        const votes = await prisma.vote.groupBy({
          by: ["type"],
          where: {target: "RELEASE", targetId: input.id},
          _count: true,
        });

        const myVote = await prisma.vote.findUnique({
          where: {
            userId_target_targetId: {
              userId: ctx.auth.user.id,
              target: "RELEASE",
              targetId: input.id,
            },
          },
        });

        const views = await prisma.view.count({
          where: {target: "RELEASE", targetId: input.id},
        });

        const reviewStats = await prisma.review.aggregate({
          where: {
            releaseId: input.id,
          },
          _count: {id: true},
          _avg: {rating: true},
        });

        const images = await prisma.image.findMany({
          where: {target: "RELEASE", targetId: release.id},
        });

        return {...release, isOwner, votes, myVote, views, reviewStats, images};
      }
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({input, ctx}) => {
      const {projectId, page, pageSize, search} = input;

      const project = await prisma.project.findFirst({
        where: {id: projectId},
      });

      if (!project) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This project does not exists.",
        });
      }

      const isOwner = project.ownerId === ctx.auth.user.id;

      const titleCondition = search
        ? {title: {contains: search, mode: "insensitive"}}
        : {};

      const visibilityCondition = isOwner ? {} : {visibility: "PUBLIC"};

      const [items, totalCount] = await Promise.all([
        prisma.release.findMany({
          where: {
            AND: [
              {projectId},
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              titleCondition as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              visibilityCondition as any,
            ],
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
          include: {
            _count: {
              select: {
                comments: true,
                reviews: true,
              },
            },
          },
        }),
        prisma.release.count({
          where: {
            AND: [
              {projectId},
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              titleCondition as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              visibilityCondition as any,
            ],
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
            where: {target: "RELEASE", targetId: item.id},
            _count: true,
          });

          const views = await prisma.view.count({
            where: {target: "RELEASE", targetId: item.id},
          });

          const reviewStats = await prisma.review.aggregate({
            where: {
              releaseId: item.id,
            },
            _count: {id: true},
            _avg: {rating: true},
          });

          const images = await prisma.image.findMany({
            where: {target: "RELEASE", targetId: item.id},
          });

          return {...item, isOwner, votes, views, reviewStats, images};
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
