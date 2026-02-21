import {render, screen} from "@testing-library/react";

import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import CreateCategory, {metadata} from "@/app/category/create/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/categories/components/create-category-form", () => {
  return function MockCreateCategoryForm() {
    return <div data-testid="create-category-form">Create Category Form</div>;
  };
});

describe("CreateCategory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Create Category");
  });

  it("invokes requireAdmin before rendering", async () => {
    (requireAdmin as jest.Mock).mockResolvedValue(undefined);

    await CreateCategory();

    expect(requireAdmin).toHaveBeenCalled();
  });

  it("calls requireAdmin and renders CreateCategoryForm", async () => {
    (requireAdmin as jest.Mock).mockResolvedValue(undefined);

    const result = await CreateCategory();
    render(result);

    expect(requireAdmin).toHaveBeenCalled();
    expect(screen.getByTestId("create-category-form")).toBeInTheDocument();
  });
});
