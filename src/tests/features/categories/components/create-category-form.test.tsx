import {render, screen, fireEvent, waitFor, act} from "@testing-library/react";

import {useCreateCategory} from "@/features/categories/hooks/use-categories";
import CreateCategoryForm from "@/features/categories/components/create-category-form";

jest.mock("@/features/categories/hooks/use-categories", () => ({
  useCreateCategory: jest.fn(),
}));

describe("CreateCategoryForm", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateCategory as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("renders correctly", () => {
    render(<CreateCategoryForm />);

    expect(
      screen.getByRole("heading", {name: /Create Category/i})
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {name: /Create Category/i})
    ).toBeInTheDocument();
  });

  it("submits the form with valid data", async () => {
    render(<CreateCategoryForm />);

    const input = screen.getByLabelText(/Category Name/i);
    fireEvent.change(input, {target: {value: "New Category"}});

    fireEvent.click(screen.getByRole("button", {name: /Create Category/i}));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {name: "New Category"},
        expect.any(Object)
      );
    });
  });

  it("shows validation error for empty name", async () => {
    render(<CreateCategoryForm />);

    fireEvent.click(screen.getByRole("button", {name: /Create Category/i}));

    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("resets form on settled", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let settledCallback: any;
    mockMutate.mockImplementation((data, options) => {
      settledCallback = options.onSettled;
    });

    render(<CreateCategoryForm />);

    const input = screen.getByLabelText(/Category Name/i) as HTMLInputElement;
    fireEvent.change(input, {target: {value: "Category to Reset"}});

    fireEvent.click(screen.getByRole("button", {name: /Create Category/i}));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    await act(async () => {
      settledCallback();
    });

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });
});
