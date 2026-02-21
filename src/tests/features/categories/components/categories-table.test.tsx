import {useRouter} from "next/navigation";
import {render, screen, fireEvent} from "@testing-library/react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useSuspenseCategories} from "@/features/categories/hooks/use-categories";
import CategoriesTable from "@/features/categories/components/categories-table";

jest.mock("@/features/categories/hooks/use-categories", () => ({
  useSuspenseCategories: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/categories/components/delete-category", () => {
  return function MockDeleteCategory({id}: {id: string}) {
    return <button data-testid={`delete-${id}`}>Delete</button>;
  };
});
jest.mock("@/features/global/components/pagination-component", () => {
  return function MockPaginationComponent({
    onPageChange,
  }: {
    onPageChange: (page: number) => void;
  }) {
    return <button onClick={() => onPageChange(2)}>Next Page</button>;
  };
});
jest.mock("@/features/global/components/empty-component", () => {
  return function MockEmptyComponent({title}: {title: string}) {
    return <div data-testid="empty-component">{title}</div>;
  };
});

describe("CategoriesTable", () => {
  const mockRouter = {push: jest.fn()};
  const mockSetParams = jest.fn();
  const mockCategories = {
    items: [
      {
        id: "1",
        name: "Category 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Category 2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    totalPages: 2,
    page: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useGlobalParams as jest.Mock).mockReturnValue([{}, mockSetParams]);
    (useSuspenseCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isFetching: false,
    });
  });

  it("renders correctly with data", () => {
    render(<CategoriesTable />);

    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();
    expect(screen.getByTestId("delete-1")).toBeInTheDocument();
    expect(screen.getByTestId("delete-2")).toBeInTheDocument();
  });

  it("navigates to update page when clicking update", () => {
    render(<CategoriesTable />);

    const updateButtons = screen.getAllByRole("button", {name: /Update/i});
    fireEvent.click(updateButtons[0]);

    expect(mockRouter.push).toHaveBeenCalledWith("/category/update/1");
  });

  it("calls setParams when changing page", () => {
    render(<CategoriesTable />);

    fireEvent.click(screen.getByText("Next Page"));

    expect(mockSetParams).toHaveBeenCalledWith({page: 2});
  });

  it("renders empty component when no categories", () => {
    (useSuspenseCategories as jest.Mock).mockReturnValue({
      data: {items: [], totalPages: 0, page: 1},
      isFetching: false,
    });

    render(<CategoriesTable />);

    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    expect(screen.getByText("No Category Found")).toBeInTheDocument();
  });
});
