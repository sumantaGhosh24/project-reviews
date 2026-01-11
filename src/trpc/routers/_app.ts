import {profileRouter} from "@/features/profile/server/router";

import {createTRPCRouter} from "../init";

export const appRouter = createTRPCRouter({
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
