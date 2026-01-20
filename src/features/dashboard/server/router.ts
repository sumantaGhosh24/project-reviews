import {TRPCError} from "@trpc/server";
import z from "zod";

import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import prisma from "@/lib/db";

export const dashboardRouter = createTRPCRouter({
  getDashboard: protectedProcedure.query(async ({ctx}) => {
    const userId = ctx.auth.user.id;

    const userCounts = await prisma.user.findUnique({
      where: {id: userId},
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        _count: {
          select: {
            projects: true,
            comments: true,
            reviews: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!userCounts) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User not found.",
      });
    }

    const votesGivenCount = await prisma.vote.count({
      where: {
        userId,
      },
    });

    const viewsGivenCount = await prisma.view.count({
      where: {
        viewerId: userId,
      },
    });

    const [projects, releases] = await Promise.all([
      prisma.project.findMany({
        where: {ownerId: userId},
        select: {id: true},
      }),
      prisma.release.findMany({
        where: {
          project: {ownerId: userId},
        },
        select: {id: true},
      }),
    ]);

    const projectIds = projects.map((p) => p.id);
    const releaseIds = releases.map((r) => r.id);

    const votesReceivedCount = await prisma.vote.count({
      where: {
        OR: [
          {target: "PROJECT", targetId: {in: projectIds}},
          {target: "RELEASE", targetId: {in: releaseIds}},
        ],
      },
    });

    const viewsReceivedCount = await prisma.view.count({
      where: {
        OR: [
          {target: "PROJECT", targetId: {in: projectIds}},
          {target: "RELEASE", targetId: {in: releaseIds}},
        ],
      },
    });

    const [unreadNotificationsCount, totalNotificationsCount] =
      await Promise.all([
        prisma.notification.count({
          where: {
            recipientId: userId,
            readAt: null,
          },
        }),
        prisma.notification.count({
          where: {
            recipientId: userId,
          },
        }),
      ]);

    return {
      id: userCounts.id,
      name: userCounts.name,
      image: userCounts.image,
      role: userCounts.role,
      counts: {
        projects: userCounts._count.projects,
        comments: userCounts._count.comments,
        reviews: userCounts._count.reviews,
        followers: userCounts._count.followers,
        following: userCounts._count.following,
        votesGiven: votesGivenCount,
        viewsGiven: viewsGivenCount,
      },
      engagement: {
        votesReceived: votesReceivedCount,
        viewsReceived: viewsReceivedCount,
      },
      notifications: {
        unread: unreadNotificationsCount,
        total: totalNotificationsCount,
      },
    };
  }),
  getAdminDashboard: protectedProcedure.query(async ({ctx}) => {
    if (ctx.auth.user.role !== "admin") {
      return {unauthorized: true};
    }

    const totalUser = await prisma.user.count();
    const totalAdmin = await prisma.user.count({
      where: {
        role: "admin",
      },
    });
    const totalNormalUser = totalUser - totalAdmin;

    const totalCategory = await prisma.category.count();

    const totalProject = await prisma.user.count();
    const totalDraftProject = await prisma.project.count({
      where: {
        status: "DRAFT",
      },
    });
    const totalDevelopmentProject = await prisma.project.count({
      where: {
        status: "DEVELOPMENT",
      },
    });
    const totalProductionProject = await prisma.project.count({
      where: {
        status: "PRODUCTION",
      },
    });
    const totalDeprecatedProject = await prisma.project.count({
      where: {
        status: "DEPRECATED",
      },
    });
    const totalPrivateProject = await prisma.project.count({
      where: {
        visibility: "PRIVATE",
      },
    });
    const totalPublicProject = await prisma.project.count({
      where: {
        visibility: "PUBLIC",
      },
    });

    const totalRelease = await prisma.release.count();
    const totalDraftRelease = await prisma.release.count({
      where: {
        status: "DRAFT",
      },
    });
    const totalDevelopmentRelease = await prisma.release.count({
      where: {
        status: "DEVELOPMENT",
      },
    });
    const totalProductionRelease = await prisma.release.count({
      where: {
        status: "PRODUCTION",
      },
    });
    const totalDeprecatedRelease = await prisma.release.count({
      where: {
        status: "DEPRECATED",
      },
    });
    const totalPrivateRelease = await prisma.release.count({
      where: {
        visibility: "PRIVATE",
      },
    });
    const totalPublicRelease = await prisma.release.count({
      where: {
        visibility: "PUBLIC",
      },
    });

    const totalComment = await prisma.comment.count({
      where: {
        parentId: null,
      },
    });

    const totalReplyComment = await prisma.comment.count({
      where: {
        parentId: {not: null},
      },
    });

    const totalReview = await prisma.review.count();

    const totalVote = await prisma.vote.count();
    const totalUpVote = await prisma.vote.count({
      where: {
        type: "UP",
      },
    });
    const totalDownVote = await prisma.vote.count({
      where: {
        type: "DOWN",
      },
    });
    const totalProjectVote = await prisma.vote.count({
      where: {
        target: "PROJECT",
      },
    });
    const totalReleaseVote = await prisma.vote.count({
      where: {
        target: "RELEASE",
      },
    });
    const totalCommentVote = await prisma.vote.count({
      where: {
        target: "COMMENT",
      },
    });
    const totalReviewVote = await prisma.vote.count({
      where: {
        target: "REVIEW",
      },
    });

    const totalView = await prisma.view.count();
    const totalProjectView = await prisma.view.count({
      where: {
        target: "PROJECT",
      },
    });
    const totalReleaseView = await prisma.view.count({
      where: {
        target: "RELEASE",
      },
    });

    const totalNotification = await prisma.notification.count();
    const totalUnreadNotification = await prisma.notification.count({
      where: {
        readAt: null,
      },
    });
    const totalReadNotification = totalNotification - totalUnreadNotification;

    return {
      user: {
        total: totalUser,
        admin: totalAdmin,
        normal: totalNormalUser,
      },
      category: {
        total: totalCategory,
      },
      project: {
        total: totalProject,
        draft: totalDraftProject,
        development: totalDevelopmentProject,
        production: totalProductionProject,
        deprecated: totalDeprecatedProject,
        private: totalPrivateProject,
        public: totalPublicProject,
      },
      release: {
        total: totalRelease,
        draft: totalDraftRelease,
        development: totalDevelopmentRelease,
        production: totalProductionRelease,
        deprecated: totalDeprecatedRelease,
        private: totalPrivateRelease,
        public: totalPublicRelease,
      },
      comment: {
        total: totalComment,
        reply: totalReplyComment,
      },
      review: {
        total: totalReview,
      },
      vote: {
        total: totalVote,
        up: totalUpVote,
        down: totalDownVote,
        project: totalProjectVote,
        release: totalReleaseVote,
        comment: totalCommentVote,
        review: totalReviewVote,
      },
      view: {
        total: totalView,
        project: totalProjectView,
        release: totalReleaseView,
      },
      notification: {
        total: totalNotification,
        unread: totalUnreadNotification,
        read: totalReadNotification,
      },
    };
  }),
  getProjectDashboard: protectedProcedure
    .input(z.object({projectId: z.string()}))
    .query(async ({ctx, input}) => {
      const {projectId} = input;

      const project = await prisma.project.findUnique({
        where: {id: projectId},
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          visibility: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          owner: {
            select: {
              id: true,
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
          message: "Project not found.",
        });
      }

      if (project.owner.id !== ctx.auth.user.id) {
        return {unauthorized: true};
      }

      const projectVotesCount = await prisma.vote.count({
        where: {
          target: "PROJECT",
          targetId: projectId,
        },
      });

      const projectViewsCount = await prisma.view.count({
        where: {
          target: "PROJECT",
          targetId: projectId,
        },
      });

      const releases = await prisma.release.findMany({
        where: {
          projectId,
        },
        orderBy: {createdAt: "desc"},
        select: {
          id: true,
        },
      });

      const releaseIds = releases.map((r) => r.id);

      const [releaseVotesCount, releaseViewsCount] = await Promise.all([
        prisma.vote.count({
          where: {
            target: "RELEASE",
            targetId: {in: releaseIds},
          },
        }),
        prisma.view.count({
          where: {
            target: "RELEASE",
            targetId: {in: releaseIds},
          },
        }),
      ]);

      const reviewStats = await prisma.review.aggregate({
        where: {
          releaseId: {in: releaseIds},
        },
        _count: {id: true},
        _avg: {rating: true},
      });

      const commentsCount = await prisma.comment.count({
        where: {
          releaseId: {in: releaseIds},
        },
      });

      return {
        project,

        counts: {
          releases: project._count.releases,
          comments: commentsCount,
          reviews: reviewStats._count.id,
        },

        engagement: {
          project: {
            votes: projectVotesCount,
            views: projectViewsCount,
          },
          releases: {
            votes: releaseVotesCount,
            views: releaseViewsCount,
          },
        },

        ratings: {
          average: reviewStats._avg.rating ?? 0,
          total: reviewStats._count.id,
        },
      };
    }),
  getReleaseDashboard: protectedProcedure
    .input(z.object({releaseId: z.string()}))
    .query(async ({ctx, input}) => {
      const {releaseId} = input;

      const release = await prisma.release.findUnique({
        where: {id: releaseId},
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          visibility: true,
          project: {
            select: {
              id: true,
              owner: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!release) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Release not found.",
        });
      }

      if (release.project.owner.id !== ctx.auth.user.id) {
        return {unauthorized: true};
      }

      const releaseVotesCount = await prisma.vote.count({
        where: {
          target: "RELEASE",
          targetId: releaseId,
        },
      });

      const releaseViewsCount = await prisma.view.count({
        where: {
          target: "RELEASE",
          targetId: releaseId,
        },
      });

      const reviewStats = await prisma.review.aggregate({
        where: {releaseId},
        _count: {id: true},
        _avg: {rating: true},
      });

      const ratingDistribution = await prisma.review.groupBy({
        by: ["rating"],
        where: {releaseId},
        _count: {rating: true},
        orderBy: {rating: "asc"},
      });

      const commentsCount = await prisma.comment.count({
        where: {releaseId},
      });

      const repliesCount = await prisma.comment.count({
        where: {
          releaseId,
          parentId: {not: null},
        },
      });

      const voteBreakdown = await prisma.vote.groupBy({
        by: ["type"],
        where: {
          target: "RELEASE",
          targetId: releaseId,
        },
        _count: {type: true},
      });

      return {
        release,
        counts: {
          comments: commentsCount,
          replies: repliesCount,
          reviews: reviewStats._count.id,
        },
        engagement: {
          votes: releaseVotesCount,
          views: releaseViewsCount,
        },
        ratings: {
          average: reviewStats._avg.rating ?? 0,
          total: reviewStats._count.id,
          distribution: ratingDistribution,
        },
        votes: {
          breakdown: voteBreakdown,
        },
      };
    }),
});
