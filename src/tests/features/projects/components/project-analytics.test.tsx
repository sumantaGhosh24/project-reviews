import {useRouter} from "next/navigation";
import {render, screen, fireEvent} from "@testing-library/react";

import {useSuspenseProjectDashboard} from "@/features/dashboard/hooks/use-dashboard";
import ProjectAnalytics from "@/features/projects/components/project-analytics";

jest.mock("@/features/dashboard/hooks/use-dashboard", () => ({
  useSuspenseProjectDashboard: jest.fn(),
}));

describe("ProjectAnalytics", () => {
  const mockDashboard = {
    unauthorized: false,
    project: {
      title: "Test Project",
      description: "Test Description",
    },
    counts: {
      releases: 5,
      comments: 10,
      reviews: 3,
    },
    engagement: {
      project: {votes: 20, views: 200},
      releases: {votes: 15, views: 150},
    },
    ratings: {
      average: 4.2,
      total: 10,
    },
  };

  const mockRouter = {
    back: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseProjectDashboard as jest.Mock).mockReturnValue({
      data: mockDashboard,
    });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders analytics data correctly", () => {
    render(<ProjectAnalytics projectId="proj1" />);

    expect(screen.getByText(/Test Project - Analytics/i)).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    expect(screen.getByText("Total Releases")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Total Comments")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("4.2 (10)")).toBeInTheDocument();
  });

  it("calls router.back when Back button is clicked", () => {
    render(<ProjectAnalytics projectId="proj1" />);

    fireEvent.click(screen.getByText(/Back to Project/i));
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("returns null if unauthorized", () => {
    (useSuspenseProjectDashboard as jest.Mock).mockReturnValue({
      data: {...mockDashboard, unauthorized: true},
    });

    const {container} = render(<ProjectAnalytics projectId="proj1" />);
    expect(container.firstChild).toBeNull();
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<ProjectAnalytics projectId="proj1" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
