import {useRouter} from "next/navigation";
import {render, screen, fireEvent} from "@testing-library/react";

import {useSuspenseReleaseDashboard} from "@/features/dashboard/hooks/use-dashboard";
import ReleaseAnalytics from "@/features/releases/components/release-analytics";

jest.mock("@/features/dashboard/hooks/use-dashboard", () => ({
  useSuspenseReleaseDashboard: jest.fn(),
}));
jest.mock("@/features/dashboard/components/stat-card", () => {
  return function MockStatCard({title, value}: {title: string; value: number}) {
    return (
      <div data-testid="stat-card">
        <span>{title}</span>
        <span>{String(value)}</span>
      </div>
    );
  };
});

const mockDashboard = {
  unauthorized: false,
  release: {
    title: "Test Release",
    description: "Test Description",
  },
  counts: {
    comments: 10,
    replies: 5,
    reviews: 3,
  },
  engagement: {
    votes: 20,
    views: 100,
  },
  ratings: {
    average: 4.5,
    total: 15,
    distribution: [
      {rating: 5, _count: {rating: 10}},
      {rating: 4, _count: {rating: 5}},
    ],
  },
  votes: {
    breakdown: [
      {type: "UPVOTE", _count: {type: 15}},
      {type: "DOWNVOTE", _count: {type: 5}},
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe("ReleaseAnalytics", () => {
  const mockRouter = {
    back: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseReleaseDashboard as jest.Mock).mockReturnValue({
      data: mockDashboard,
    });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders correctly with analytics data", () => {
    render(<ReleaseAnalytics releaseId="release1" />);

    expect(screen.getByText(/test release - analytics/i)).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    expect(screen.getByText("Total Comments")).toBeInTheDocument();
    expect(screen.getAllByText("10")).toHaveLength(2);

    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("4.5 (15)")).toBeInTheDocument();

    expect(screen.getByText("Rating 5")).toBeInTheDocument();
    expect(screen.getByText("UPVOTE Votes")).toBeInTheDocument();
  });

  it("handles back button click", () => {
    render(<ReleaseAnalytics releaseId="release1" />);
    const backButton = screen.getByRole("button", {name: /back to release/i});
    fireEvent.click(backButton);
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("returns null if unauthorized", () => {
    (useSuspenseReleaseDashboard as jest.Mock).mockReturnValue({
      data: {unauthorized: true},
    });
    const {container} = render(<ReleaseAnalytics releaseId="release1" />);
    expect(container).toBeEmptyDOMElement();
  });
});
