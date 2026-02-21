import {render, screen} from "@testing-library/react";

import ManageDashboardComments from "@/features/comments/components/manage-dashboard-comments";

jest.mock("@/features/comments/components/dashboard-comments-table", () => {
  return function MockDashboardCommentsTable() {
    return <div data-testid="dashboard-comments-table">Mock Table</div>;
  };
});

describe("ManageDashboardComments", () => {
  it("renders correctly with title and table", () => {
    render(<ManageDashboardComments />);

    expect(screen.getByText("Manage My Comments")).toBeInTheDocument();
    expect(screen.getByText("Manage my comments.")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-comments-table")).toBeInTheDocument();
  });
});
