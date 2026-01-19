import {TRPCError} from "@trpc/server";
import z from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db";
import {PAGINATION} from "@/constants/pagination";

export const projectsRouter = createTRPCRouter({
  create: premiumProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        content: z.string(),
        categoryId: z.string(),
        tags: z.array(z.string()),
        githubUrl: z.string(),
        websiteUrl: z.string(),
      })
    )
    .mutation(async ({input, ctx}) => {
      const {
        title,
        description,
        content,
        categoryId,
        tags,
        githubUrl,
        websiteUrl,
      } = input;

      const exists = await prisma.category.findUnique({
        where: {id: categoryId},
        select: {id: true},
      });

      if (!exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category does not exist.",
        });
      }

      return prisma.project.create({
        data: {
          title,
          description,
          content,
          tags: tags ?? [],
          owner: {
            connect: {
              id: ctx.auth.user.id,
            },
          },
          status: "DRAFT",
          visibility: "PRIVATE",
          category: {
            connect: {
              id: categoryId,
            },
          },
          githubUrl,
          websiteUrl,
        },
      });
    }),
  update: premiumProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        content: z.string(),
        categoryId: z.string(),
        tags: z.array(z.string()),
        githubUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
        status: z.enum(["DRAFT", "DEVELOPMENT", "PRODUCTION", "DEPRECATED"]),
        visibility: z.enum(["PRIVATE", "PUBLIC", "UNLISTED"]),
      })
    )
    .mutation(async ({input, ctx}) => {
      const {
        id,
        title,
        description,
        content,
        categoryId,
        tags,
        githubUrl,
        websiteUrl,
        status,
        visibility,
      } = input;

      const project = await prisma.project.findUnique({
        where: {id: id, ownerId: ctx.auth.user.id},
      });
      if (!project) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This project does not exists.",
        });
      }

      const exists = await prisma.category.findUnique({
        where: {id: categoryId},
        select: {id: true},
      });

      if (!exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category does not exist.",
        });
      }

      return prisma.$transaction(async (tx) => {
        const project = await prisma.project.update({
          where: {id: id, ownerId: ctx.auth.user.id},
          data: {
            title,
            description,
            content,
            tags: tags ?? [],
            owner: {
              connect: {
                id: ctx.auth.user.id,
              },
            },
            status,
            visibility,
            category: {
              connect: {
                id: categoryId,
              },
            },
            githubUrl,
            websiteUrl,
            publishedAt: visibility === "PUBLIC" ? new Date() : null,
          },
        });

        if (project.visibility !== "PUBLIC") return project;

        const followers = await tx.follow.findMany({
          where: {
            followingId: ctx.auth.user.id,
          },
          select: {
            followerId: true,
          },
        });

        if (followers.length === 0) return project;

        await tx.notification.createMany({
          data: followers.map((f) => ({
            type: "RELEASE_PUBLISHED",
            recipientId: f.followerId,
            actorId: ctx.auth.user.id,
            target: "PROJECT",
            targetId: project.id,
            title: "New project published",
            body: `${ctx.auth.user.name} published a new project`,
            url: `/project/details/${project.id}`,
          })),
          skipDuplicates: true,
        });

        return project;
      });
    }),
  remove: premiumProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input, ctx}) => {
      const project = await prisma.project.deleteMany({
        where: {
          id: input.id,
          ownerId: ctx.auth.user.id,
        },
      });

      if (project.count === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This project does not exists.",
        });
      }

      return project;
    }),
  getOne: premiumProcedure
    .input(z.object({id: z.string()}))
    .query(async ({input, ctx}) => {
      return prisma.project.findUnique({
        where: {
          id: input.id,
          ownerId: ctx.auth.user.id,
        },
        include: {
          category: true,
        },
      });
    }),
  getAll: adminProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
        category: z.string().default(""),
      })
    )
    .query(async ({input}) => {
      const {page, pageSize, search, category} = input;

      const getCategoryByName = async (name: string) => {
        return await prisma.category.findFirst({
          where: {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        });
      };

      const titleCondition = search
        ? {title: {contains: search, mode: "insensitive"}}
        : {};

      const categoryCondition = category
        ? await getCategoryByName(category)
        : null;

      const [items, totalCount] = await Promise.all([
        prisma.project.findMany({
          where: {
            AND: [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              titleCondition as any,
              categoryCondition ? {categoryId: categoryCondition.id} : {},
            ],
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            category: {
              select: {id: true, name: true},
            },
            _count: {select: {releases: true}},
          },
        }),
        prisma.project.count({
          where: {
            AND: [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              titleCondition as any,
              categoryCondition ? {categoryId: categoryCondition.id} : {},
            ],
          },
        }),
      ]);

      const itemsWithVote = await Promise.all(
        items.map(async (item) => {
          const votes = await prisma.vote.groupBy({
            by: ["type"],
            where: {target: "PROJECT", targetId: item.id},
            _count: true,
          });

          const views = await prisma.view.count({
            where: {target: "PROJECT", targetId: item.id},
          });

          return {...item, votes, views};
        })
      );

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

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
  getPublic: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
        category: z.string().default(""),
      })
    )
    .query(async ({input}) => {
      const {page, pageSize, search, category} = input;

      const getCategoryByName = async (name: string) => {
        return await prisma.category.findFirst({
          where: {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        });
      };

      const titleCondition = search
        ? {title: {contains: search, mode: "insensitive"}}
        : {};

      const categoryCondition = category
        ? await getCategoryByName(category)
        : null;

      const [items, totalCount] = await Promise.all([
        prisma.project.findMany({
          where: {
            AND: [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              titleCondition as any,
              categoryCondition ? {categoryId: categoryCondition.id} : {},
              {visibility: "PUBLIC"},
            ],
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            category: {
              select: {id: true, name: true},
            },
            _count: {select: {releases: true}},
          },
        }),
        prisma.project.count({
          where: {
            AND: [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              titleCondition as any,
              categoryCondition ? {categoryId: categoryCondition.id} : {},
              {visibility: "PUBLIC"},
            ],
          },
        }),
      ]);

      const itemsWithVote = await Promise.all(
        items.map(async (item) => {
          const votes = await prisma.vote.groupBy({
            by: ["type"],
            where: {target: "PROJECT", targetId: item.id},
            _count: true,
          });

          const views = await prisma.view.count({
            where: {target: "PROJECT", targetId: item.id},
          });

          return {...item, votes, views};
        })
      );

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

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
        search: z.string().default(""),
        category: z.string().default(""),
      })
    )
    .query(async ({input, ctx}) => {
      const {page, pageSize, search, category} = input;

      const getCategoryByName = async (name: string) => {
        return await prisma.category.findFirst({
          where: {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        });
      };

      const titleCondition = search
        ? {title: {contains: search, mode: "insensitive"}}
        : {};

      const categoryCondition = category
        ? await getCategoryByName(category)
        : null;

      const [items, totalCount] = await Promise.all([
        prisma.project.findMany({
          where: {
            AND: [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              titleCondition as any,
              categoryCondition ? {categoryId: categoryCondition.id} : {},
              {ownerId: ctx.auth.user.id},
            ],
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            category: {
              select: {id: true, name: true},
            },
            _count: {select: {releases: true}},
          },
        }),
        prisma.project.count({
          where: {
            AND: [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              titleCondition as any,
              categoryCondition ? {categoryId: categoryCondition.id} : {},
              {ownerId: ctx.auth.user.id},
            ],
          },
        }),
      ]);

      const itemsWithVote = await Promise.all(
        items.map(async (item) => {
          const votes = await prisma.vote.groupBy({
            by: ["type"],
            where: {target: "PROJECT", targetId: item.id},
            _count: true,
          });

          const views = await prisma.view.count({
            where: {target: "PROJECT", targetId: item.id},
          });

          return {...item, votes, views};
        })
      );

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

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
  getUserAll: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
        category: z.string().default(""),
      })
    )
    .query(async ({input}) => {
      const {userId, page, pageSize, search, category} = input;

      const getCategoryByName = async (name: string) => {
        return await prisma.category.findFirst({
          where: {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        });
      };

      const titleCondition = search
        ? {title: {contains: search, mode: "insensitive"}}
        : {};

      const categoryCondition = category
        ? await getCategoryByName(category)
        : null;

      const [items, totalCount] = await Promise.all([
        prisma.project.findMany({
          where: {
            AND: [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              titleCondition as any,
              categoryCondition ? {categoryId: categoryCondition.id} : {},
              {ownerId: userId, visibility: "PUBLIC"},
            ],
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            category: {
              select: {id: true, name: true},
            },
            _count: {select: {releases: true}},
          },
        }),
        prisma.project.count({
          where: {
            AND: [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              titleCondition as any,
              categoryCondition ? {categoryId: categoryCondition.id} : {},
              {ownerId: userId, visibility: "PUBLIC"},
            ],
          },
        }),
      ]);

      const itemsWithVote = await Promise.all(
        items.map(async (item) => {
          const votes = await prisma.vote.groupBy({
            by: ["type"],
            where: {target: "PROJECT", targetId: item.id},
            _count: true,
          });

          const views = await prisma.view.count({
            where: {target: "PROJECT", targetId: item.id},
          });

          return {...item, votes, views};
        })
      );

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

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
  view: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({input, ctx}) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
          visibility: "PUBLIC",
        },
        include: {
          category: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              releases: true,
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This project does not exists.",
        });
      }

      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const isUniqueView = await prisma.view.findFirst({
        where: {
          target: "PROJECT",
          targetId: input.id,
          createdAt: {gte: since},
          viewerId: ctx.auth.user.id,
        },
        select: {id: true},
      });

      if (!isUniqueView) {
        await prisma.view.create({
          data: {
            target: "PROJECT",
            targetId: input.id,
            viewerId: ctx.auth.user.id,
          },
        });
      }

      const votes = await prisma.vote.groupBy({
        by: ["type"],
        where: {target: "PROJECT", targetId: input.id},
        _count: true,
      });

      const myVote = await prisma.vote.findUnique({
        where: {
          userId_target_targetId: {
            userId: ctx.auth.user.id,
            target: "PROJECT",
            targetId: input.id,
          },
        },
      });

      const views = await prisma.view.count({
        where: {target: "PROJECT", targetId: input.id},
      });

      const isOwner = project.ownerId === ctx.auth.user.id;

      return {...project, isOwner, votes, myVote, views};
    }),
});
