import {TRPCError} from "@trpc/server";
import z from "zod";

import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import prisma from "@/lib/db";
import {PAGINATION} from "@/constants/pagination";

export const profileRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({input, ctx}) => {
      const currentUserFollowings = await prisma.user.findUnique({
        where: {id: ctx?.auth?.user?.id},
        select: {followingIds: true},
      });

      const followersCount = await prisma.user.count({
        where: {
          followingIds: {
            has: input.id,
          },
        },
      });

      const existingUser = await prisma.user.findUnique({
        where: {id: input.id},
      });

      const isFollowing = currentUserFollowings?.followingIds?.includes(
        input.id
      );

      const isActiveUser = ctx?.auth?.user?.id === existingUser?.id;

      return {...existingUser, followersCount, isFollowing, isActiveUser};
    }),
  handleFollow: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({input, ctx}) => {
      if (!input.userId || typeof input.userId !== "string") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid user id.",
        });
      }
      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not exists.",
        });
      }

      const currentUser = await prisma.user.findUnique({
        where: {
          id: ctx.auth.user.id,
        },
      });
      if (!currentUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not exists.",
        });
      }

      let updatedFollowingIds = [...(currentUser.followingIds || [])];

      const method = updatedFollowingIds.includes(input.userId)
        ? "DELETE"
        : "POST";

      if (method === "POST") {
        updatedFollowingIds.push(input.userId);
      }
      if (method === "DELETE") {
        updatedFollowingIds = updatedFollowingIds.filter(
          (followingId) => followingId !== input.userId
        );
      }
      await prisma.user.update({
        where: {
          id: ctx.auth.user.id,
        },
        data: {
          followingIds: updatedFollowingIds,
        },
      });

      return {user, currentUser};
    }),
  getFollowers: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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
      const {id, page, pageSize, search} = input;

      const currentUserFollowings = await prisma.user.findUnique({
        where: {id: ctx.auth.user.id},
        select: {followingIds: true},
      });

      const [items, totalCount] = await Promise.all([
        prisma.user.findMany({
          where: {
            AND: [
              {
                followingIds: {
                  has: id,
                },
              },
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
        }),
        prisma.user.count({
          where: {
            AND: [
              {
                followingIds: {
                  has: id,
                },
              },
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        }),
      ]);

      const itemsWithIsFollowing = items.map((item) => ({
        ...item,
        isFollowing: currentUserFollowings?.followingIds?.includes(item.id),
        isActiveUser: ctx.auth.user.id === item.id,
      }));

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items: itemsWithIsFollowing,
        totalCount,
        page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
  getFollowings: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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
      const {id, page, pageSize, search} = input;

      const currentUserFollowings = await prisma.user.findUnique({
        where: {id: ctx.auth.user.id},
        select: {followingIds: true},
      });

      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not exists.",
        });
      }

      if (!user.followingIds) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not exists.",
        });
      }

      const [items, totalCount] = await Promise.all([
        prisma.user.findMany({
          where: {
            AND: [
              {
                id: {
                  in: user.followingIds,
                },
              },
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
        }),
        prisma.user.count({
          where: {
            AND: [
              {
                id: {
                  in: user.followingIds,
                },
              },
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        }),
      ]);

      const itemsWithIsFollowing = items.map((item) => ({
        ...item,
        isFollowing: currentUserFollowings?.followingIds?.includes(item.id),
        isActiveUser: ctx.auth.user.id === item.id,
      }));

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items: itemsWithIsFollowing,
        totalCount,
        page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
