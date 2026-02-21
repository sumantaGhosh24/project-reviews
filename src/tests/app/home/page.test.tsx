import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import {prefetchPublicProjects} from "@/features/projects/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import Home, {metadata} from "@/app/home/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/categories/server/prefetch");
jest.mock("@/features/projects/server/prefetch");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/projects/components/manage-home-projects", () => {
  return function MockManageHomeProjects() {
    return <div data-testid="manage-home-projects">Manage Home Projects</div>;
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

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockParams = {page: 1, limit: 10};

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Home");
  });

  it("calls requireAuth, prefetches categories and public projects", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await Home({
      searchParams: Promise.resolve({}),
      params: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalled();
    expect(prefetchPublicProjects).toHaveBeenCalledWith(mockParams);
    expect(prefetchAllCategory).toHaveBeenCalled();
    expect(screen.getByTestId("manage-home-projects")).toBeInTheDocument();
  });
});
