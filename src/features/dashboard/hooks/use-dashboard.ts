import {useSuspenseQuery} from "@tanstack/react-query";

import {useTRPC} from "@/trpc/client";

export const useSuspenseDashboard = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.dashboard.getDashboard.queryOptions());
};

export const useSuspenseAdminDashboard = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.dashboard.getAdminDashboard.queryOptions());
};

export const useSuspenseProjectDashboard = (projectId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.dashboard.getProjectDashboard.queryOptions({projectId})
  );
};

export const useSuspenseReleaseDashboard = (releaseId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.dashboard.getReleaseDashboard.queryOptions({releaseId})
  );
};
