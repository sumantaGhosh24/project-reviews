import {createElement} from "react";
import {
  useSuspenseQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {renderHook} from "@testing-library/react";

import {useTRPC} from "@/trpc/client";
import {
  useSuspenseDashboard,
  useSuspenseAdminDashboard,
  useSuspenseProjectDashboard,
  useSuspenseReleaseDashboard,
} from "@/features/dashboard/hooks/use-dashboard";

describe("useDashboard hooks", () => {
  const mockTRPC = {
    dashboard: {
      getDashboard: {queryOptions: jest.fn()},
      getAdminDashboard: {queryOptions: jest.fn()},
      getProjectDashboard: {queryOptions: jest.fn()},
      getReleaseDashboard: {queryOptions: jest.fn()},
    },
  };

  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  let queryClient: QueryClient;

  const wrapper = ({children}: {children: React.ReactNode}) =>
    createElement(
      QueryClientProvider,
      {client: queryClient},
      children
    );

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
    (useTRPC as jest.Mock).mockReturnValue(mockTRPC);
  });

  it("useSuspenseDashboard calls getDashboard.queryOptions", () => {
    mockTRPC.dashboard.getDashboard.queryOptions.mockReturnValue({
      queryKey: ["dashboard"],
    });
    renderHook(() => useSuspenseDashboard(), {wrapper});
    expect(mockTRPC.dashboard.getDashboard.queryOptions).toHaveBeenCalled();
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["dashboard"]});
  });

  it("useSuspenseAdminDashboard calls getAdminDashboard.queryOptions", () => {
    mockTRPC.dashboard.getAdminDashboard.queryOptions.mockReturnValue({
      queryKey: ["admin"],
    });
    renderHook(() => useSuspenseAdminDashboard(), {wrapper});
    expect(
      mockTRPC.dashboard.getAdminDashboard.queryOptions
    ).toHaveBeenCalled();
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["admin"]});
  });

  it("useSuspenseProjectDashboard calls getProjectDashboard.queryOptions", () => {
    mockTRPC.dashboard.getProjectDashboard.queryOptions.mockReturnValue({
      queryKey: ["project"],
    });
    renderHook(() => useSuspenseProjectDashboard("p1"), {wrapper});
    expect(
      mockTRPC.dashboard.getProjectDashboard.queryOptions
    ).toHaveBeenCalledWith({projectId: "p1"});
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["project"]});
  });

  it("useSuspenseReleaseDashboard calls getReleaseDashboard.queryOptions", () => {
    mockTRPC.dashboard.getReleaseDashboard.queryOptions.mockReturnValue({
      queryKey: ["release"],
    });
    renderHook(() => useSuspenseReleaseDashboard("r1"), {wrapper});
    expect(
      mockTRPC.dashboard.getReleaseDashboard.queryOptions
    ).toHaveBeenCalledWith({releaseId: "r1"});
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["release"]});
  });
});
