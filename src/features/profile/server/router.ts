import {TRPCError} from "@trpc/server";
import z from "zod";

import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import prisma from "@/lib/db";
import {PAGINATION} from "@/constants/pagination";

export const profileRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({input, ctx}) => {
      const user = await prisma.user.findUnique({
        where: {id: input.id},
      });

      const following = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: ctx?.auth?.user?.id,
            followingId: input.id,
          },
        },
      });
      const isFollowing = Boolean(following);

      const isActiveUser = ctx?.auth?.user?.id === user?.id;

      const followersCount = await prisma.follow.count({
        where: {
          followingId: input.id,
        },
      });

      const followingsCount = await prisma.follow.count({
        where: {
          followerId: input.id,
        },
      });

      const projectsCount = await prisma.project.count({
        where: {
          ownerId: input.id,
        },
      });

      return {
        ...user,
        isFollowing,
        isActiveUser,
        followersCount,
        followingsCount,
        projectsCount,
      };
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

      if (ctx?.auth?.user?.id === input.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't follow yourself.",
        });
      }

      const exists = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: ctx?.auth?.user?.id,
            followingId: input.userId,
          },
        },
      });

      if (exists) {
        await prisma.follow.delete({
          where: {
            followerId_followingId: {
              followerId: ctx?.auth?.user?.id,
              followingId: input.userId,
            },
          },
        });
      } else {
        await prisma.follow.create({
          data: {
            followerId: ctx?.auth?.user?.id,
            followingId: input.userId,
          },
        });

        await prisma.notification.create({
          data: {
            type: "FOLLOW",
            recipientId: input.userId,
            actorId: ctx?.auth?.user?.id,
            target: "USER",
            targetId: ctx?.auth?.user?.id,
            title: "New follower",
            body: `You have been followed by ${ctx?.auth?.user?.name}`,
            url: `${process.env.BETTER_AUTH_URL}/profile/${ctx?.auth?.user?.id}/details`,
          },
        });
      }

      return {user, currentUser: {id: ctx.auth.user.id}};
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
      })
    )
    .query(async ({input, ctx}) => {
      const {id, page, pageSize} = input;

      const [items, totalCount] = await Promise.all([
        prisma.follow.findMany({
          where: {
            followingId: id,
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
          select: {
            follower: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        }),
        prisma.follow.count({
          where: {
            followingId: id,
          },
        }),
      ]);

      const itemsWithIsFollowing = await Promise.all(
        items
          .map((f) => f.follower)
          .map(async (item) => {
            const following = await prisma.follow.findUnique({
              where: {
                followerId_followingId: {
                  followerId: ctx.auth.user.id,
                  followingId: item.id,
                },
              },
            });

            return {
              ...item,
              isFollowing: Boolean(following),
              isActiveUser: ctx.auth.user.id === item.id,
            };
          })
      );

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
      })
    )
    .query(async ({input, ctx}) => {
      const {id, page, pageSize} = input;

      const [items, totalCount] = await Promise.all([
        prisma.follow.findMany({
          where: {
            followerId: id,
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {createdAt: "desc"},
          select: {
            following: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        }),
        prisma.follow.count({
          where: {
            followerId: id,
          },
        }),
      ]);

      const itemsWithIsFollowing = await Promise.all(
        items
          .map((f) => f.following)
          .map(async (item) => {
            const following = await prisma.follow.findUnique({
              where: {
                followerId_followingId: {
                  followerId: ctx.auth.user.id,
                  followingId: item.id,
                },
              },
            });

            return {
              ...item,
              isFollowing: Boolean(following),
              isActiveUser: ctx.auth.user.id === item.id,
            };
          })
      );

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
