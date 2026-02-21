import {render, screen} from "@testing-library/react";

import ManageCategories from "@/features/categories/components/manage-categories";

jest.mock("@/features/categories/components/categories-table", () => {
  return function MockCategoriesTable() {
    return <div data-testid="categories-table">Mock Categories Table</div>;
  };
});
jest.mock("@/features/global/components/search-bar-component", () => {
  return function MockSearchBarComponent({placeholder}: {placeholder: string}) {
    return <input data-testid="search-bar" placeholder={placeholder} />;
  };
});

describe("ManageCategories", () => {
  it("renders correctly with title, button, search and table", () => {
    render(<ManageCategories />);

    expect(screen.getByText("Manage Categories")).toBeInTheDocument();
    expect(
      screen.getByText("Admin manage all categories.")
    ).toBeInTheDocument();

    const createLink = screen.getByRole("link", {name: /Create Category/i});
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute("href", "/category/create");

    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search categories")
    ).toBeInTheDocument();
    expect(screen.getByTestId("categories-table")).toBeInTheDocument();
  });
});
