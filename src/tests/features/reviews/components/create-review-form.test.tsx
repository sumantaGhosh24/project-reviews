import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {axe, toHaveNoViolations} from "jest-axe";

import {useCreateReview} from "@/features/reviews/hooks/use-reviews";
import {CreateReviewForm} from "@/features/reviews/components/create-review-form";

expect.extend(toHaveNoViolations);

jest.mock("@/features/reviews/hooks/use-reviews");

describe("CreateReviewForm", () => {
  const mockReleaseId = "rel-1";
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateReview as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("renders correctly", () => {
    render(<CreateReviewForm releaseId={mockReleaseId} />);

    expect(screen.getByLabelText(/Review Feedback/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {name: /Post Review/i})
    ).toBeInTheDocument();
  });

  it("submits the form with valid data and calls onSuccess", async () => {
    mockMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });

    render(<CreateReviewForm releaseId={mockReleaseId} />);

    fireEvent.change(screen.getByTestId("select-rating"), {
      target: {value: "4"},
    });
    fireEvent.change(screen.getByLabelText(/Review Feedback/i), {
      target: {value: "This is a test feedback"},
    });

    fireEvent.click(screen.getByRole("button", {name: /Post Review/i}));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    expect(screen.getByLabelText(/Review Feedback/i)).toHaveValue("");
  });

  it("shows validation error for empty feedback", async () => {
    render(<CreateReviewForm releaseId={mockReleaseId} />);

    fireEvent.click(screen.getByRole("button", {name: /Post Review/i}));

    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("disables button when pending", () => {
    (useCreateReview as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<CreateReviewForm releaseId={mockReleaseId} />);

    expect(screen.getByRole("button", {name: /Post Review/i})).toBeDisabled();
  });

  it("should have no accessibility violations", async () => {
    const {container} = render(<CreateReviewForm releaseId={mockReleaseId} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
