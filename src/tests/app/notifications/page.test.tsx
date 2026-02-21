import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import {prefetchNotifications} from "@/features/notifications/server/prefetch";
import NotificationsPage, {metadata} from "@/app/notifications/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/notifications/server/prefetch");
jest.mock("@/features/notifications/components/manage-notifications", () => {
  return function MockManageNotifications() {
    return <div data-testid="manage-notifications">Manage Notifications</div>;
  };
});
jest.mock("@/features/global/components/error-component", () => {
  return function MockErrorComponent() {
    return <div data-testid="error-component">Error</div>;
  };
});
jest.mock("@/features/global/components/loading-component", () => {
  return function MockLoadingComponent() {
    return <div data-testid="loading-component">Loading...</div>;
  };
});

describe("NotificationsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockParams = {page: 1, limit: 10};

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Manage Notifications");
  });

  it("calls requireAuth, globalParamsLoader and prefetches notifications", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await NotificationsPage({
      searchParams: Promise.resolve({}),
      params: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalled();
    expect(prefetchNotifications).toHaveBeenCalledWith(mockParams);
    expect(screen.getByTestId("manage-notifications")).toBeInTheDocument();
  });
});
