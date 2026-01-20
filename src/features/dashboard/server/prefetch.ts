import {prefetch, trpc} from "@/trpc/server";

export const prefetchDashboard = async () => {
  await prefetch(trpc.dashboard.getDashboard.queryOptions());
};

export const prefetchAdminDashboard = async () => {
  await prefetch(trpc.dashboard.getAdminDashboard.queryOptions());
};

export const prefetchProjectDashboard = async (projectId: string) => {
  await prefetch(trpc.dashboard.getProjectDashboard.queryOptions({projectId}));
};

export const prefetchReleaseDashboard = async (releaseId: string) => {
  await prefetch(trpc.dashboard.getReleaseDashboard.queryOptions({releaseId}));
};
