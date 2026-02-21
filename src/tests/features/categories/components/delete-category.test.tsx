import {axe} from "jest-axe";
import {render, screen, fireEvent} from "@testing-library/react";

import {useRemoveCategory} from "@/features/categories/hooks/use-categories";
import DeleteCategory from "@/features/categories/components/delete-category";

jest.mock("@/features/categories/hooks/use-categories", () => ({
  useRemoveCategory: jest.fn(),
}));
jest.mock("@/components/loading-swap", () => ({
  LoadingSwap: ({
    children,
    isLoading,
  }: {
    children: React.ReactNode;
    isLoading: boolean;
  }) => (
    <div data-testid="loading-swap" data-loading={isLoading}>
      {children}
    </div>
  ),
}));

describe("DeleteCategory", () => {
  const mockMutate = jest.fn();
  const mockId = "cat-123";

  beforeEach(() => {
    jest.clearAllMocks();
    (useRemoveCategory as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("should have no accessibility violations", async () => {
    const {container} = render(<DeleteCategory id={mockId} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders correctly", () => {
    render(<DeleteCategory id={mockId} />);

    expect(screen.getByTestId("alert-dialog-trigger")).toHaveTextContent(
      "Delete Category"
    );
    expect(
      screen.getByText(
        "Are you absolutely sure you want to delete this category?"
      )
    ).toBeInTheDocument();
  });

  it("calls mutate when delete button is clicked", () => {
    render(<DeleteCategory id={mockId} />);

    const deleteBtn = screen.getByTestId("alert-dialog-action");
    fireEvent.click(deleteBtn);

    expect(mockMutate).toHaveBeenCalledWith({id: mockId});
  });

  it("shows loading state when isPending is true", () => {
    (useRemoveCategory as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<DeleteCategory id={mockId} />);

    const deleteBtn = screen.getByTestId("alert-dialog-action");
    expect(deleteBtn).toBeDisabled();
    expect(screen.getByTestId("loading-swap")).toHaveAttribute(
      "data-loading",
      "true"
    );
  });
});
