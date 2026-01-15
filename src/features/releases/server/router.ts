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
      })
    )
    .mutation(async ({input, ctx}) => {
      const {projectId, title, description, content} = input;

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
        });

        if (!release) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This release does not exists.",
          });
        }

        return {...release, isOwner};
      } else {
        const release = await prisma.release.findFirst({
          where: {id: input.id},
        });

        if (!release) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This release does not exists.",
          });
        }

        return {...release, isOwner};
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

      const itemsWithOwner = items.map((item) => ({...item, isOwner}));

      return {
        items: itemsWithOwner,
        totalCount,
        page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
