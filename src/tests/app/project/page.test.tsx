import {render, screen} from "@testing-library/react";

import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {prefetchAllProjects} from "@/features/projects/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import ProjectsPage, {metadata} from "@/app/project/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/categories/server/prefetch");
jest.mock("@/features/projects/server/prefetch");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/projects/components/manage-projects", () => {
  return function MockManageProjects() {
    return <div data-testid="manage-projects">Manage Projects</div>;
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

describe("ProjectsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockParams = {page: 1, limit: 10};

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Manage Projects");
  });

  it("calls requireAdmin, prefetches categories and all projects", async () => {
    (requireAdmin as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await ProjectsPage({
      searchParams: Promise.resolve({}),
      params: Promise.resolve({}),
    });
    render(result);

    expect(requireAdmin).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalled();
    expect(prefetchAllProjects).toHaveBeenCalledWith(mockParams);
    expect(prefetchAllCategory).toHaveBeenCalled();
    expect(screen.getByTestId("manage-projects")).toBeInTheDocument();
  });
});
