import {profileRouter} from "@/features/profile/server/router";
import {notificationsRouter} from "@/features/notifications/server/router";
import {categoriesRouter} from "@/features/categories/server/router";
import {projectsRouter} from "@/features/projects/server/router";
import {releasesRouter} from "@/features/releases/server/router";

import {createTRPCRouter} from "../init";

export const appRouter = createTRPCRouter({
  profile: profileRouter,
  notification: notificationsRouter,
  category: categoriesRouter,
  project: projectsRouter,
  release: releasesRouter,
});

export type AppRouter = typeof appRouter;
