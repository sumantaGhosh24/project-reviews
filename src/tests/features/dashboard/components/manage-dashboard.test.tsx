import {render, screen} from "@testing-library/react";

import {
  useSuspenseDashboard,
  useSuspenseAdminDashboard,
} from "@/features/dashboard/hooks/use-dashboard";
import ManageDashboard from "@/features/dashboard/components/manage-dashboard";

jest.mock("@/features/dashboard/hooks/use-dashboard", () => ({
  useSuspenseDashboard: jest.fn(),
  useSuspenseAdminDashboard: jest.fn(),
}));

describe("ManageDashboard", () => {
  const mockDashboardData = {
    name: "John Doe",
    image: "https://example.com/avatar.png",
    counts: {
      projects: 5,
      comments: 10,
      reviews: 3,
      followers: 20,
      following: 15,
      votesGiven: 50,
      viewsGiven: 100,
    },
    engagement: {
      votesReceived: 200,
      viewsReceived: 1000,
    },
    notifications: {
      unread: 2,
      total: 10,
    },
  };

  const mockAdminDashboardData = {
    unauthorized: false,
    user: {total: 100, admin: 5, normal: 95},
    category: {total: 10},
    project: {
      total: 50,
      draft: 5,
      development: 10,
      production: 30,
      deprecated: 2,
      private: 3,
      public: 47,
    },
    release: {
      total: 200,
      draft: 10,
      development: 20,
      production: 160,
      deprecated: 5,
      private: 5,
      public: 195,
    },
    comment: {total: 1000, reply: 200},
    review: {total: 300},
    vote: {
      total: 5000,
      up: 4500,
      down: 500,
      project: 1000,
      release: 2000,
      comment: 1500,
      review: 500,
    },
    view: {total: 50000, project: 10000, release: 40000},
    notification: {total: 10000, unread: 1000, read: 9000},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseDashboard as jest.Mock).mockReturnValue({
      data: mockDashboardData,
    });
    (useSuspenseAdminDashboard as jest.Mock).mockReturnValue({
      data: mockAdminDashboardData,
    });
  });

  it("renders user dashboard information correctly", () => {
    render(<ManageDashboard />);

    expect(screen.getByText(/Welcome back, John Doe/i)).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();

    const projectCard = screen
      .getByText("Projects")
      .closest("div")?.parentElement;
    expect(projectCard).toHaveTextContent("5");

    expect(screen.getByText("Comments")).toBeInTheDocument();
    const commentCard = screen
      .getByText("Comments")
      .closest("div")?.parentElement;
    expect(commentCard).toHaveTextContent("10");
  });

  it("renders admin dashboard when authorized", () => {
    render(<ManageDashboard />);

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getAllByText("100")).toHaveLength(2);
  });

  it("does not render admin dashboard when unauthorized", () => {
    (useSuspenseAdminDashboard as jest.Mock).mockReturnValue({
      data: {...mockAdminDashboardData, unauthorized: true},
    });

    render(<ManageDashboard />);

    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<ManageDashboard />);
    expect(asFragment()).toMatchSnapshot();
  });
});
