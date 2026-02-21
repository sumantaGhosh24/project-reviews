import {useRouter} from "next/navigation";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {
  useSuspenseNotifications,
  useReadNotification,
} from "@/features/notifications/hooks/use-notifications";
import NotificationsTable from "@/features/notifications/components/notifications-table";

jest.mock("@/features/notifications/hooks/use-notifications", () => ({
  useSuspenseNotifications: jest.fn(),
  useReadNotification: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

describe("NotificationsTable", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockNotifications = {
    items: [
      {
        id: "1",
        title: "Test Notification",
        body: "Test Body",
        createdAt: new Date().toISOString(),
        readAt: null,
        url: "/test-url",
      },
      {
        id: "2",
        title: "Read Notification",
        body: "Read Body",
        createdAt: new Date().toISOString(),
        readAt: new Date().toISOString(),
        url: "/read-url",
      },
    ],
    totalPages: 1,
    page: 1,
  };

  const mockMarkRead = {
    mutate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSuspenseNotifications as jest.Mock).mockReturnValue({
      data: mockNotifications,
      isFetching: false,
    });
    (useGlobalParams as jest.Mock).mockReturnValue([{}, jest.fn()]);
    (useReadNotification as jest.Mock).mockReturnValue(mockMarkRead);
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<NotificationsTable />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders notifications list", () => {
    render(<NotificationsTable />);
    expect(screen.getByText("Test Notification")).toBeInTheDocument();
    expect(screen.getByText("Read Notification")).toBeInTheDocument();
    expect(screen.getByText("Test Body")).toBeInTheDocument();
    expect(screen.getByText("Read Body")).toBeInTheDocument();
  });

  it("calls markRead when Mark Read is clicked", () => {
    render(<NotificationsTable />);
    fireEvent.click(screen.getByText("Mark Read"));
    expect(mockMarkRead.mutate).toHaveBeenCalledWith({id: "1"});
  });

  it("calls markRead and redirects when Visit is clicked", async () => {
    render(<NotificationsTable />);
    fireEvent.click(screen.getAllByText("Visit")[0]);

    expect(mockMarkRead.mutate).toHaveBeenCalledWith({id: "1"});
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/test-url");
    });
  });

  it("renders empty state when no notifications", () => {
    (useSuspenseNotifications as jest.Mock).mockReturnValue({
      data: {items: [], totalPages: 0, page: 1},
      isFetching: false,
    });

    render(<NotificationsTable />);
    expect(screen.getByText("No Notifications Found")).toBeInTheDocument();
  });

  it("updates params when page changes", () => {
    const setParams = jest.fn();
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1}, setParams]);
    (useSuspenseNotifications as jest.Mock).mockReturnValue({
      data: {...mockNotifications, totalPages: 2},
      isFetching: false,
    });

    render(<NotificationsTable />);

    const nextControl = screen.getByText(/next/i);
    fireEvent.click(nextControl);

    expect(setParams).toHaveBeenCalledWith({page: 2});
  });
});
