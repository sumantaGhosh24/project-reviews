import {render, screen} from "@testing-library/react";

import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import {prefetchCategory} from "@/features/categories/server/prefetch";
import UpdateCategory, {metadata} from "@/app/category/update/[id]/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/categories/server/prefetch");
jest.mock("@/features/categories/components/update-category-form", () => {
  return function MockUpdateCategoryForm({id}: {id: string}) {
    return (
      <div data-testid="update-category-form">Update Category Form {id}</div>
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

describe("UpdateCategory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-category-id";

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Update Category");
  });

  it("calls requireAdmin and prefetches category data", async () => {
    (requireAdmin as jest.Mock).mockResolvedValue(undefined);

    const result = await UpdateCategory({
      params: Promise.resolve({id: mockId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireAdmin).toHaveBeenCalled();
    expect(prefetchCategory).toHaveBeenCalledWith(mockId);
    expect(screen.getByTestId("update-category-form")).toHaveTextContent(
      mockId
    );
  });

  it("renders ErrorBoundary and Suspense", async () => {
    (requireAdmin as jest.Mock).mockResolvedValue(undefined);

    const result = await UpdateCategory({
      params: Promise.resolve({id: mockId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(screen.getByTestId("update-category-form")).toBeInTheDocument();
  });
});
