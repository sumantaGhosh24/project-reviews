import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {prefetchUserProjects} from "@/features/projects/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import ProfileProjectsPage from "@/app/profile/[id]/details/@projects/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/categories/server/prefetch");
jest.mock("@/features/projects/server/prefetch");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/projects/components/profile-projects", () => {
  return function MockProfileProjects({id}: {id: string}) {
    return <div data-testid="profile-projects">Profile Projects {id}</div>;
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

describe("ProfileProjectsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-user-id";
  const mockParams = {page: 1, limit: 10};

  it("calls requireAuth, prefetches user projects and categories", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await ProfileProjectsPage({
      params: Promise.resolve({id: mockId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalled();
    expect(prefetchUserProjects).toHaveBeenCalledWith({
      userId: mockId,
      ...mockParams,
    });
    expect(prefetchAllCategory).toHaveBeenCalled();
    expect(screen.getByTestId("profile-projects")).toHaveTextContent(mockId);
  });
});
