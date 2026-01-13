import z from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db";
import {PAGINATION} from "@/constants/pagination";

export const notificationsRouter = createTRPCRouter({
  getAll: protectedProcedure
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
        prisma.notification.findMany({
          where: {
            recipientId: ctx?.auth?.user?.id,
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
        }),
        prisma.notification.count({
          where: {
            recipientId: ctx?.auth?.user?.id,
          },
        }),
      ]);

      const unreadCount = await prisma.notification.count({
        where: {
          recipientId: ctx?.auth?.user?.id,
          readAt: null,
        },
      });

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
        unreadCount,
      };
    }),
  readAll: protectedProcedure.mutation(async ({ctx}) => {
    return prisma.notification.updateMany({
      where: {
        recipientId: ctx?.auth?.user?.id,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }),
  readOne: adminProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input, ctx}) => {
      return prisma.notification.updateMany({
        where: {
          id: input.id,
          recipientId: ctx?.auth?.user?.id,
          readAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });
    }),
});
