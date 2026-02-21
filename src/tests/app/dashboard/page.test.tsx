import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {
  prefetchAdminDashboard,
  prefetchDashboard,
} from "@/features/dashboard/server/prefetch";
import Dashboard, {metadata} from "@/app/dashboard/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/dashboard/server/prefetch");
jest.mock("@/features/dashboard/components/manage-dashboard", () => {
  return function MockManageDashboard() {
    return <div data-testid="manage-dashboard">Manage Dashboard</div>;
  };
});
jest.mock("@/features/global/components/error-component", () => {
  return function MockErrorComponent() {
    return <div data-testid="error-component">Error</div>;
  };
});
jest.mock("@/features/global/components/loading-component", () => {
  return function MockLoadingComponent() {
    return <div data-testid="loading-component">Loading...</div>;
  };
});

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Dashboard");
  });

  it("calls requireAuth and prefetches dashboard data", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);

    const result = await Dashboard();
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(prefetchDashboard).toHaveBeenCalled();
    expect(prefetchAdminDashboard).toHaveBeenCalled();
    expect(screen.getByTestId("manage-dashboard")).toBeInTheDocument();
  });

  it("renders ErrorBoundary and Suspense", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);

    const result = await Dashboard();
    render(result);

    expect(screen.getByTestId("manage-dashboard")).toBeInTheDocument();
  });
});
