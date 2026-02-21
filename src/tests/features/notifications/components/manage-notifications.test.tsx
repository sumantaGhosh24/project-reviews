import {render, screen} from "@testing-library/react";

import ManageNotifications from "@/features/notifications/components/manage-notifications";

jest.mock(
  "@/features/notifications/components/mark-all-notifications-read",
  () => ({
    __esModule: true,
    default: () => <div>Mark All Read</div>,
  })
);
jest.mock("@/features/notifications/components/notifications-table", () => ({
  __esModule: true,
  default: () => <div>Notifications Table</div>,
}));

describe("ManageNotifications", () => {
  it("matches snapshot", () => {
    const {asFragment} = render(<ManageNotifications />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders with correct title and description", () => {
    render(<ManageNotifications />);
    expect(screen.getByText("Manage Notifications")).toBeInTheDocument();
    expect(
      screen.getByText("Admin manage all notifications.")
    ).toBeInTheDocument();
  });

  it("renders child components", () => {
    render(<ManageNotifications />);
    expect(screen.getByText("Mark All Read")).toBeInTheDocument();
    expect(screen.getByText("Notifications Table")).toBeInTheDocument();
  });
});
