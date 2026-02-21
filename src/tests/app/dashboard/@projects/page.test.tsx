import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {prefetchMyProjects} from "@/features/projects/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import DashboardProjectsPage from "@/app/dashboard/@projects/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/categories/server/prefetch");
jest.mock("@/features/projects/server/prefetch");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/projects/components/manage-dashboard-projects", () => {
  return function MockManageDashboardProjects() {
    return (
      <div data-testid="manage-dashboard-projects">
        Manage Dashboard Projects
      </div>
    );
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

describe("DashboardProjectsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSearchParams = {page: "1", pageSize: "10"};
  const mockParams = {page: 1, pageSize: 10};

  it("calls requireAuth and prefetches projects data", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await DashboardProjectsPage({
      searchParams: Promise.resolve(mockSearchParams),
      params: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalledWith(expect.any(Promise));
    expect(prefetchMyProjects).toHaveBeenCalledWith(mockParams);
    expect(prefetchAllCategory).toHaveBeenCalled();
    expect(screen.getByTestId("manage-dashboard-projects")).toBeInTheDocument();
  });

  it("renders ErrorBoundary and Suspense", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await DashboardProjectsPage({
      searchParams: Promise.resolve(mockSearchParams),
      params: Promise.resolve({}),
    });
    render(result);

    expect(screen.getByTestId("manage-dashboard-projects")).toBeInTheDocument();
  });
});
