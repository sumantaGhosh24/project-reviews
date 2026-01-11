import {TRPCError} from "@trpc/server";
import z from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db";
import {PAGINATION} from "@/constants/pagination";

export const categoriesRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({input}) => {
      const existingCategory = await prisma.category.findUnique({
        where: {name: input.name.toLowerCase()},
      });
      if (existingCategory) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category already exists.",
        });
      }

      return prisma.category.create({
        data: {
          name: input.name,
        },
      });
    }),
  remove: adminProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input}) => {
      const projects = await prisma.project.findFirst({
        where: {categoryId: input.id},
      });
      if (projects) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please delete all project of this category first.",
        });
      }

      return prisma.category.delete({
        where: {id: input.id},
      });
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({input}) => {
      const category = await prisma.category.findUnique({
        where: {id: input.id},
      });
      if (!category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category not found.",
        });
      }

      return prisma.category.update({
        where: {id: input.id},
        data: {
          name: input.name,
        },
      });
    }),
  getAll: protectedProcedure.query(() => {
    return prisma.category.findMany();
  }),
  getAllPaginated: adminProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({input}) => {
      const {page, pageSize, search} = input;

      const [items, totalCount] = await Promise.all([
        prisma.category.findMany({
          where: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
        }),
        prisma.category.count({
          where: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        totalCount,
        page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
  getOne: adminProcedure
    .input(z.object({id: z.string()}))
    .query(async ({input}) => {
      return prisma.category.findUnique({
        where: {id: input.id},
      });
    }),
});
