import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {
  useSuspenseCategory,
  useUpdateCategory,
} from "@/features/categories/hooks/use-categories";
import UpdateCategoryForm from "@/features/categories/components/update-category-form";

jest.mock("@/features/categories/hooks/use-categories", () => ({
  useSuspenseCategory: jest.fn(),
  useUpdateCategory: jest.fn(),
}));

describe("UpdateCategoryForm", () => {
  const mockMutate = jest.fn();
  const categoryId = "cat-123";
  const mockCategory = {id: categoryId, name: "Old Name"};

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseCategory as jest.Mock).mockReturnValue({data: mockCategory});
    (useUpdateCategory as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("renders correctly with initial data", () => {
    render(<UpdateCategoryForm id={categoryId} />);

    expect(
      screen.getByRole("heading", {name: /Update Category/i})
    ).toBeInTheDocument();
    const input = screen.getByLabelText(/Category Name/i) as HTMLInputElement;
    expect(input.value).toBe("Old Name");
  });

  it("submits the form with updated data", async () => {
    render(<UpdateCategoryForm id={categoryId} />);

    const input = screen.getByLabelText(/Category Name/i);
    fireEvent.change(input, {target: {value: "New Name"}});

    fireEvent.click(screen.getByRole("button", {name: /Update Category/i}));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: categoryId,
        name: "New Name",
      });
    });
  });

  it("shows validation error for empty name", async () => {
    render(<UpdateCategoryForm id={categoryId} />);

    const input = screen.getByLabelText(/Category Name/i);
    fireEvent.change(input, {target: {value: ""}});

    fireEvent.click(screen.getByRole("button", {name: /Update Category/i}));

    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("disables the button while pending", () => {
    (useUpdateCategory as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<UpdateCategoryForm id={categoryId} />);

    expect(
      screen.getByRole("button", {name: /Update Category/i})
    ).toBeDisabled();
  });
});
