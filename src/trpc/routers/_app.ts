import {profileRouter} from "@/features/profile/server/router";
import {notificationsRouter} from "@/features/notifications/server/router";
import {categoriesRouter} from "@/features/categories/server/router";
import {projectsRouter} from "@/features/projects/server/router";
import {releasesRouter} from "@/features/releases/server/router";
import {commentsRouter} from "@/features/comments/server/router";
import {reviewsRouter} from "@/features/reviews/server/router";
import {votesRouter} from "@/features/votes/server/router";
import {dashboardRouter} from "@/features/dashboard/server/router";

import {createTRPCRouter} from "../init";

export const appRouter = createTRPCRouter({
  profile: profileRouter,
  notification: notificationsRouter,
  category: categoriesRouter,
  project: projectsRouter,
  release: releasesRouter,
  comment: commentsRouter,
  review: reviewsRouter,
  vote: votesRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
