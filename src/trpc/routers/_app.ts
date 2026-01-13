import {profileRouter} from "@/features/profile/server/router";
import {notificationsRouter} from "@/features/notifications/server/router";
import {categoriesRouter} from "@/features/categories/server/router";

import {createTRPCRouter} from "../init";

export const appRouter = createTRPCRouter({
  profile: profileRouter,
  notification: notificationsRouter,
  category: categoriesRouter,
});

export type AppRouter = typeof appRouter;
