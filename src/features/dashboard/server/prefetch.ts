import {prefetch, trpc} from "@/trpc/server";

export const prefetchDashboard = async () => {
  await prefetch(trpc.dashboard.getDashboard.queryOptions());
};

export const prefetchAdminDashboard = async () => {
  await prefetch(trpc.dashboard.getAdminDashboard.queryOptions());
};
