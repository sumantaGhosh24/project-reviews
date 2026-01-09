import {createTRPCRouter} from "../init";

export const appRouter = createTRPCRouter({
  category: {},
});

export type AppRouter = typeof appRouter;
