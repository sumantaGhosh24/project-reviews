import {render, screen, fireEvent} from "@testing-library/react";

import {useSuspenseAllCategories} from "@/features/categories/hooks/use-categories";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useEntityFilter} from "@/features/global/hooks/use-entity-filter";
import FilterComponent from "@/features/global/components/filter-component";

jest.mock("@/features/categories/hooks/use-categories", () => ({
  useSuspenseAllCategories: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-entity-filter", () => ({
  useEntityFilter: jest.fn(),
}));

describe("FilterComponent", () => {
  const mockCategories = [
    {id: "1", name: "Tech"},
    {id: "2", name: "Design"},
  ];
  const mockParams = {category: "Tech", page: 1};
  const mockSetParams = jest.fn();
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    (useSuspenseAllCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
    });
    (useGlobalParams as jest.Mock).mockReturnValue([mockParams, mockSetParams]);
    (useEntityFilter as jest.Mock).mockReturnValue({
      filterValue: "Tech",
      onFilterChange: mockOnFilterChange,
    });
  });

  it("renders with categories", () => {
    render(<FilterComponent />);

    expect(screen.getByText("All Categories")).toBeInTheDocument();
    expect(screen.getByText("Tech")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("calls onFilterChange when value changes", () => {
    render(<FilterComponent />);

    const select = screen.getByTestId("select-rating");
    fireEvent.change(select, {target: {value: "Design"}});

    expect(mockOnFilterChange).toHaveBeenCalledWith("Design");
  });
});
