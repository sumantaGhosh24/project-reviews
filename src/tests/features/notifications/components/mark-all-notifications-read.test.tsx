import {render, screen, fireEvent} from "@testing-library/react";

import {useReadAllNotification} from "@/features/notifications/hooks/use-notifications";
import MarkAllNotificationsRead from "@/features/notifications/components/mark-all-notifications-read";

jest.mock("@/features/notifications/hooks/use-notifications", () => ({
  useReadAllNotification: jest.fn(),
}));

describe("MarkAllNotificationsRead", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useReadAllNotification as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<MarkAllNotificationsRead />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the trigger button", () => {
    render(<MarkAllNotificationsRead />);
    const triggerButtons = screen.getAllByText("Mark All Notification Read");
    expect(triggerButtons[0]).toBeInTheDocument();
  });

  it("opens the alert dialog when clicked", () => {
    render(<MarkAllNotificationsRead />);
    const triggerButtons = screen.getAllByText("Mark All Notification Read");
    fireEvent.click(triggerButtons[0]);
    expect(screen.getByText(/Are you absolutely sure/)).toBeInTheDocument();
  });

  it("calls mutate when confirmed", async () => {
    render(<MarkAllNotificationsRead />);
    const triggerButtons = screen.getAllByText("Mark All Notification Read");
    fireEvent.click(triggerButtons[0]);

    const actionButtons = screen.getAllByText("Mark All Notification Read");
    fireEvent.click(actionButtons[1]);

    expect(mockMutate).toHaveBeenCalled();
  });

  it("disables the action button when pending", () => {
    (useReadAllNotification as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<MarkAllNotificationsRead />);
    const triggerButtons = screen.getAllByText("Mark All Notification Read");
    fireEvent.click(triggerButtons[0]);

    const actionButton = screen.getByTestId("alert-dialog-action");
    expect(actionButton).toBeDisabled();
  });
});
