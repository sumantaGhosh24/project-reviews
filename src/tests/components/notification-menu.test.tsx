import {render, screen} from "@testing-library/react";

import {useNotificationCount} from "@/features/notifications/hooks/use-notifications";
import NotificationMenu from "@/components/notification-menu";

jest.mock("@/features/notifications/hooks/use-notifications", () => ({
  useNotificationCount: jest.fn(),
}));

describe("NotificationMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders skeleton while notifications are loading", () => {
    (useNotificationCount as jest.Mock).mockReturnValue({
      data: undefined,
      isPending: true,
    });

    const {container} = render(<NotificationMenu />);

    expect(screen.queryByText(/notifications/i)).not.toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders link without badge when count is zero", () => {
    (useNotificationCount as jest.Mock).mockReturnValue({
      data: 0,
      isPending: false,
    });

    const {container} = render(<NotificationMenu />);

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(container.querySelector(".animate-ping")).toBeNull();
  });

  it("renders badge when there are unread notifications", () => {
    (useNotificationCount as jest.Mock).mockReturnValue({
      data: 3,
      isPending: false,
    });

    const {container} = render(<NotificationMenu />);

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(container.querySelector(".animate-ping")).toBeInTheDocument();
  });
});

