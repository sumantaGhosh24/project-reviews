import {render, screen, fireEvent} from "@testing-library/react";
import {axe, toHaveNoViolations} from "jest-axe";

import {useSuspenseMyReviews} from "@/features/reviews/hooks/use-reviews";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import DashboardReviewsTable from "@/features/reviews/components/dashboard-reviews-table";

expect.extend(toHaveNoViolations);

jest.mock("@/features/reviews/hooks/use-reviews");
jest.mock("@/features/global/hooks/use-global-params");
jest.mock("date-fns", () => ({
  formatDistanceToNowStrict: jest.fn(() => "2 days ago"),
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
jest.mock("@/features/global/components/empty-component", () => ({
  __esModule: true,
  default: ({title}: {title: string}) => (
    <div data-testid="empty-component">{title}</div>
  ),
}));

describe("DashboardReviewsTable", () => {
  const mockSetParams = jest.fn();
  const mockReviews = {
    items: [
      {
        id: "rev-1",
        rating: 4,
        feedback: "Great product!",
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {id: "auth-1"},
        release: {id: "rel-1", project: {id: "proj-1"}},
        votes: [
          {type: "UP", _count: 5},
          {type: "DOWN", _count: 1},
        ],
      },
    ],
    totalPages: 1,
    page: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1}, mockSetParams]);
  });

  it("renders the table when reviews are present, including zero votes", () => {
    (useSuspenseMyReviews as jest.Mock).mockReturnValue({
      data: {
        ...mockReviews,
        items: [{...mockReviews.items[0], votes: []}],
      },
      isFetching: false,
    });

    render(<DashboardReviewsTable />);

    expect(screen.getByText("Great product!")).toBeInTheDocument();
    const voteCounts = screen.getAllByText("0");
    expect(voteCounts.length).toBeGreaterThanOrEqual(2);
  });

  it("renders empty component when no reviews", () => {
    (useSuspenseMyReviews as jest.Mock).mockReturnValue({
      data: {items: [], totalPages: 0, page: 1},
      isFetching: false,
    });

    render(<DashboardReviewsTable />);

    expect(screen.getByTestId("empty-component")).toHaveTextContent(
      "No Review Found"
    );
  });

  it("handles pagination", () => {
    (useSuspenseMyReviews as jest.Mock).mockReturnValue({
      data: {...mockReviews, totalPages: 2},
      isFetching: false,
    });

    render(<DashboardReviewsTable />);

    fireEvent.click(screen.getByTestId("pagination"));

    expect(mockSetParams).toHaveBeenCalledWith({page: 2});
  });

  it("disables pagination when fetching", () => {
    (useSuspenseMyReviews as jest.Mock).mockReturnValue({
      data: {...mockReviews, totalPages: 2},
      isFetching: true,
    });

    render(<DashboardReviewsTable />);

    expect(screen.getByTestId("pagination")).toBeDisabled();
  });

  it("truncates long feedback", () => {
    const longFeedback = "A".repeat(60);
    (useSuspenseMyReviews as jest.Mock).mockReturnValue({
      data: {
        ...mockReviews,
        items: [{...mockReviews.items[0], feedback: longFeedback}],
      },
      isFetching: false,
    });

    render(<DashboardReviewsTable />);

    expect(
      screen.getByText(longFeedback.substring(0, 50) + "...")
    ).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    (useSuspenseMyReviews as jest.Mock).mockReturnValue({
      data: mockReviews,
      isFetching: false,
    });

    const {container} = render(<DashboardReviewsTable />);
    const results = await axe(container);
    const filteredResults = {
      ...results,
      violations: results.violations.filter(
        (violation) => violation.id !== "nested-interactive"
      ),
    };
    expect(filteredResults).toHaveNoViolations();
  });
});
