import {prefetch, trpc} from "@/trpc/server";
import {
  prefetchDashboard,
  prefetchAdminDashboard,
  prefetchProjectDashboard,
  prefetchReleaseDashboard,
} from "@/features/dashboard/server/prefetch";

jest.mock("@/trpc/server", () => {
  const prefetch = jest.fn();
  const trpc = {
    dashboard: {
      getDashboard: {queryOptions: jest.fn()},
      getAdminDashboard: {queryOptions: jest.fn()},
      getProjectDashboard: {queryOptions: jest.fn()},
      getReleaseDashboard: {queryOptions: jest.fn()},
    },
  };

  return {prefetch, trpc};
});

describe("dashboard prefetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prefetches user dashboard", async () => {
    const options = {queryKey: ["dashboard"], queryFn: jest.fn()};
    (trpc.dashboard.getDashboard.queryOptions as jest.Mock).mockReturnValue(
      options
    );

    await prefetchDashboard();

    expect(trpc.dashboard.getDashboard.queryOptions).toHaveBeenCalled();
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches admin dashboard", async () => {
    const options = {queryKey: ["admin-dashboard"], queryFn: jest.fn()};
    (
      trpc.dashboard.getAdminDashboard.queryOptions as jest.Mock
    ).mockReturnValue(options);

    await prefetchAdminDashboard();

    expect(trpc.dashboard.getAdminDashboard.queryOptions).toHaveBeenCalled();
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches project dashboard", async () => {
    const projectId = "p1";
    const options = {queryKey: ["project-dashboard"], queryFn: jest.fn()};
    (
      trpc.dashboard.getProjectDashboard.queryOptions as jest.Mock
    ).mockReturnValue(options);

    await prefetchProjectDashboard(projectId);

    expect(
      trpc.dashboard.getProjectDashboard.queryOptions
    ).toHaveBeenCalledWith({projectId});
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches release dashboard", async () => {
    const releaseId = "r1";
    const options = {queryKey: ["release-dashboard"], queryFn: jest.fn()};
    (
      trpc.dashboard.getReleaseDashboard.queryOptions as jest.Mock
    ).mockReturnValue(options);

    await prefetchReleaseDashboard(releaseId);

    expect(
      trpc.dashboard.getReleaseDashboard.queryOptions
    ).toHaveBeenCalledWith({releaseId});
    expect(prefetch).toHaveBeenCalledWith(options);
  });
});
