import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchReleaseDashboard} from "@/features/dashboard/server/prefetch";
import ReleaseAnalyticsPage, {
  metadata,
} from "@/app/project/details/[id]/release/[releaseId]/analytics/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/dashboard/server/prefetch");
jest.mock("@/features/releases/components/release-analytics", () => {
  return function MockReleaseAnalytics({releaseId}: {releaseId: string}) {
    return (
      <div data-testid="release-analytics">Release Analytics {releaseId}</div>
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

describe("ReleaseAnalyticsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockReleaseId = "test-release-id";

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Release Analytics");
  });

  it("calls requireAuth and prefetches release dashboard data", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);

    const result = await ReleaseAnalyticsPage({
      params: Promise.resolve({id: "test-id", releaseId: mockReleaseId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(prefetchReleaseDashboard).toHaveBeenCalledWith(mockReleaseId);
    expect(screen.getByTestId("release-analytics")).toHaveTextContent(
      mockReleaseId
    );
  });
});
