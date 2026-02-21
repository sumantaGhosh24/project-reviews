import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchMyReviews} from "@/features/reviews/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import DashboardReviewsPage from "@/app/dashboard/@reviews/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/reviews/server/prefetch");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/reviews/components/manage-dashboard-reviews", () => {
  return function MockManageDashboardReviews() {
    return (
      <div data-testid="manage-dashboard-reviews">Manage Dashboard Reviews</div>
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

describe("DashboardReviewsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSearchParams = {page: "1", pageSize: "10"};
  const mockParams = {page: 1, pageSize: 10};

  it("calls requireAuth and prefetches reviews data", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await DashboardReviewsPage({
      searchParams: Promise.resolve(mockSearchParams),
      params: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalledWith(expect.any(Promise));
    expect(prefetchMyReviews).toHaveBeenCalledWith(mockParams);
    expect(screen.getByTestId("manage-dashboard-reviews")).toBeInTheDocument();
  });

  it("renders ErrorBoundary and Suspense", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await DashboardReviewsPage({
      searchParams: Promise.resolve(mockSearchParams),
      params: Promise.resolve({}),
    });
    render(result);

    expect(screen.getByTestId("manage-dashboard-reviews")).toBeInTheDocument();
  });
});
