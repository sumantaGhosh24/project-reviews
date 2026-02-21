import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchProjectDashboard} from "@/features/dashboard/server/prefetch";
import ProjectAnalyticsPage, {
  metadata,
} from "@/app/project/details/[id]/analytics/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/dashboard/server/prefetch");
jest.mock("@/features/projects/components/project-analytics", () => {
  return function MockProjectAnalytics({projectId}: {projectId: string}) {
    return (
      <div data-testid="project-analytics">Project Analytics {projectId}</div>
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

describe("ProjectAnalyticsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-project-id";

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Project Analytics");
  });

  it("calls requireAuth and prefetches project dashboard data", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);

    const result = await ProjectAnalyticsPage({
      params: Promise.resolve({id: mockId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(prefetchProjectDashboard).toHaveBeenCalledWith(mockId);
    expect(screen.getByTestId("project-analytics")).toHaveTextContent(mockId);
  });
});
