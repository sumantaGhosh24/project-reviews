import {render, screen, fireEvent} from "@testing-library/react";
import {axe, toHaveNoViolations} from "jest-axe";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useSuspenseReviews} from "@/features/reviews/hooks/use-reviews";
import {ReviewList} from "@/features/reviews/components/review-list";

expect.extend(toHaveNoViolations);

jest.mock("@/features/reviews/hooks/use-reviews");
jest.mock("@/features/global/hooks/use-global-params");
jest.mock("@/features/reviews/components/review-item", () => ({
  ReviewItem: ({review}: {review: {feedback: string}}) => (
    <div data-testid="review-item">{review.feedback}</div>
  ),
}));
jest.mock("@/features/global/components/empty-component", () => ({
  __esModule: true,
  default: ({title}: {title: string}) => (
    <div data-testid="empty-component">{title}</div>
  ),
}));
jest.mock("@/features/global/components/pagination-component", () => ({
  __esModule: true,
  default: ({
    onPageChange,
    disabled,
  }: {
    onPageChange: (page: number) => void;
    disabled: boolean;
  }) => (
    <button
      data-testid="pagination"
      onClick={() => onPageChange(2)}
      disabled={disabled}
    >
      Next Page
    </button>
  ),
}));

describe("ReviewList", () => {
  const mockReleaseId = "rel-1";
  const mockSetParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1}, mockSetParams]);
  });

  it("renders reviews when items are present", () => {
    (useSuspenseReviews as jest.Mock).mockReturnValue({
      data: {
        items: [{id: "rev-1", feedback: "Review 1"}],
        totalPages: 1,
        page: 1,
      },
      isFetching: false,
    });

    render(<ReviewList releaseId={mockReleaseId} />);

    expect(screen.getByTestId("review-item")).toHaveTextContent("Review 1");
    expect(screen.queryByTestId("empty-component")).not.toBeInTheDocument();
  });

  it("renders empty component when no reviews", () => {
    (useSuspenseReviews as jest.Mock).mockReturnValue({
      data: {
        items: [],
        totalPages: 0,
        page: 1,
      },
      isFetching: false,
    });

    render(<ReviewList releaseId={mockReleaseId} />);

    expect(screen.getByTestId("empty-component")).toHaveTextContent(
      "No Review Found"
    );
    expect(screen.queryByTestId("review-item")).not.toBeInTheDocument();
  });

  it("renders pagination when more than one page", () => {
    (useSuspenseReviews as jest.Mock).mockReturnValue({
      data: {
        items: [{id: "rev-1", feedback: "Review 1"}],
        totalPages: 2,
        page: 1,
      },
      isFetching: false,
    });

    render(<ReviewList releaseId={mockReleaseId} />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("handles page change", () => {
    (useSuspenseReviews as jest.Mock).mockReturnValue({
      data: {
        items: [{id: "rev-1", feedback: "Review 1"}],
        totalPages: 2,
        page: 1,
      },
      isFetching: false,
    });

    render(<ReviewList releaseId={mockReleaseId} />);

    fireEvent.click(screen.getByTestId("pagination"));

    expect(mockSetParams).toHaveBeenCalledWith({page: 2});
  });

  it("disables pagination when fetching", () => {
    (useSuspenseReviews as jest.Mock).mockReturnValue({
      data: {
        items: [{id: "rev-1", feedback: "Review 1"}],
        totalPages: 2,
        page: 1,
      },
      isFetching: true,
    });

    render(<ReviewList releaseId={mockReleaseId} />);

    expect(screen.getByTestId("pagination")).toBeDisabled();
  });

  it("should have no accessibility violations", async () => {
    (useSuspenseReviews as jest.Mock).mockReturnValue({
      data: {
        items: [{id: "rev-1", feedback: "Review 1"}],
        totalPages: 1,
        page: 1,
      },
      isFetching: false,
    });

    const {container} = render(<ReviewList releaseId={mockReleaseId} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
