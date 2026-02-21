import {axe} from "jest-axe";
import {render, screen} from "@testing-library/react";

import ManageReviews from "@/features/reviews/components/manage-reviews";

jest.mock("@/features/reviews/components/review-list", () => ({
  ReviewList: () => <div data-testid="review-list">Review List</div>,
}));
jest.mock("@/features/reviews/components/create-review-form", () => ({
  CreateReviewForm: () => (
    <div data-testid="create-review-form">Create Review Form</div>
  ),
}));

describe("ManageReviews", () => {
  const mockReleaseId = "rel-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have no accessibility violations", async () => {
    const {container} = render(<ManageReviews releaseId={mockReleaseId} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders correctly with children", () => {
    render(<ManageReviews releaseId={mockReleaseId} />);
    expect(screen.getByText("All Reviews")).toBeInTheDocument();
    expect(screen.getByTestId("review-list")).toBeInTheDocument();
    expect(screen.getByTestId("create-review-form")).toBeInTheDocument();
  });
});
