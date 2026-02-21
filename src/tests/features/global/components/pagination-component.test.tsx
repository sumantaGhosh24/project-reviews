import {axe} from "jest-axe";
import {render, screen, fireEvent} from "@testing-library/react";

import PaginationComponent from "@/features/global/components/pagination-component";

describe("PaginationComponent", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have no accessibility violations", async () => {
    const {container} = render(
      <PaginationComponent
        page={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders correct page info", () => {
    render(
      <PaginationComponent
        page={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("calls onPageChange when clicking next", () => {
    render(
      <PaginationComponent
        page={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );
    const nextBtn = screen.getByLabelText(/Go to next page/i);
    fireEvent.click(nextBtn);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange when clicking previous", () => {
    render(
      <PaginationComponent
        page={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );
    const prevBtn = screen.getByLabelText(/Go to previous page/i);
    fireEvent.click(prevBtn);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("disables previous button on first page", () => {
    render(
      <PaginationComponent
        page={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );
    const prevBtn = screen.getByLabelText(/Go to previous page/i);
    expect(prevBtn).toHaveClass("opacity-50");
    fireEvent.click(prevBtn);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it("disables next button on last page", () => {
    render(
      <PaginationComponent
        page={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );
    const nextBtn = screen.getByLabelText(/Go to next page/i);
    expect(nextBtn).toHaveClass("opacity-50");
    fireEvent.click(nextBtn);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it("disables both buttons when disabled prop is true", () => {
    render(
      <PaginationComponent
        page={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        disabled={true}
      />
    );
    const prevBtn = screen.getByLabelText(/Go to previous page/i);
    const nextBtn = screen.getByLabelText(/Go to next page/i);
    expect(prevBtn).toHaveClass("opacity-50");
    expect(nextBtn).toHaveClass("opacity-50");
    fireEvent.click(prevBtn);
    fireEvent.click(nextBtn);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it("renders Page 1 of 1 when totalPages is 0", () => {
    render(
      <PaginationComponent
        page={1}
        totalPages={0}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });
});
