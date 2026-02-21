import {render, screen} from "@testing-library/react";

import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import {prefetchCategories} from "@/features/categories/server/prefetch";
import CategoriesPage, {metadata} from "@/app/category/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/categories/server/prefetch");
jest.mock("@/features/categories/components/manage-categories", () => {
  return function MockManageCategories({id}: {id: string}) {
    return <div data-testid="manage-categories">Manage Categories {id}</div>;
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

describe("CategoriesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Manage Category");
  });

  it("calls requireAdmin and prefetches categories", async () => {
    const mockSearchParams = {page: "1"};
    const mockParams = {page: 1, pageSize: 10};

    (requireAdmin as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const Page = await CategoriesPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve(mockSearchParams),
    });
    render(Page);

    expect(requireAdmin).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalledWith(expect.any(Promise));
    expect(prefetchCategories).toHaveBeenCalledWith(mockParams);
    expect(screen.getByTestId("manage-categories")).toBeInTheDocument();
  });

  it("renders ErrorBoundary and Suspense", async () => {
    (requireAdmin as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue({});

    const Page = await CategoriesPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve({}),
    });
    render(Page);

    expect(screen.getByTestId("hydrate-client")).toBeInTheDocument();
  });
});
