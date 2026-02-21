import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchMyComments} from "@/features/comments/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import DashboardCommentsPage from "@/app/dashboard/@comments/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/comments/server/prefetch");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/comments/components/manage-dashboard-comments", () => {
  return function MockManageDashboardComments() {
    return (
      <div data-testid="manage-dashboard-comments">
        Manage Dashboard Comments
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

describe("DashboardCommentsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSearchParams = {page: "1", pageSize: "10"};
  const mockParams = {page: 1, pageSize: 10};

  it("calls requireAuth and prefetches comments data", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await DashboardCommentsPage({
      searchParams: Promise.resolve(mockSearchParams),
      params: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalledWith(expect.any(Promise));
    expect(prefetchMyComments).toHaveBeenCalledWith(mockParams);
    expect(screen.getByTestId("manage-dashboard-comments")).toBeInTheDocument();
  });

  it("renders ErrorBoundary and Suspense", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await DashboardCommentsPage({
      searchParams: Promise.resolve(mockSearchParams),
      params: Promise.resolve({}),
    });
    render(result);

    expect(screen.getByTestId("manage-dashboard-comments")).toBeInTheDocument();
  });
});
