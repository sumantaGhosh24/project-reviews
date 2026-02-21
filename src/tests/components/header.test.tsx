import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {useHasActiveSubscription} from "@/features/subscriptions/hooks/useSubscription";
import Header from "@/components/header";

jest.mock("@/features/subscriptions/hooks/useSubscription", () => ({
  useHasActiveSubscription: jest.fn(),
}));

jest.mock("@/components/notification-menu", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="notification-menu" />,
  };
});
jest.mock("@/components/mode-toggle", () => ({
  ModeToggle: () => <div data-testid="mode-toggle" />,
}));

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (authClient.admin.hasPermission as jest.Mock).mockResolvedValue({
      data: {success: false},
    });
  });

  const mockRouter = {
    push: jest.fn(),
  };

  it("renders guest links when not logged in", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
    });
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    render(<Header />);

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders user links and logout when logged in", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: {user: {name: "Test User", image: null}},
      isPending: false,
    });
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    render(<Header />);

    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });

  it("renders admin links when user has permission", async () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: {user: {name: "Admin User"}},
      isPending: false,
    });
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });
    (authClient.admin.hasPermission as jest.Mock).mockResolvedValue({
      data: {success: true},
    });

    render(<Header />);

    await waitFor(() => {
      expect(screen.getByText("Manage")).toBeInTheDocument();
    });
  });

  it("handles sign out", async () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: {user: {name: "Test User"}},
      isPending: false,
    });
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });
    (authClient.signOut as jest.Mock).mockImplementation(({fetchOptions}) => {
      fetchOptions.onSuccess();
    });

    render(<Header />);

    fireEvent.click(screen.getByText("Logout"));

    expect(authClient.signOut).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("You logged out successfully!");
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("handles subscribe", async () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: {user: {name: "Test User"}},
      isPending: false,
    });
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    render(<Header />);

    fireEvent.click(screen.getByText("Subscribe"));

    expect(authClient.checkout).toHaveBeenCalledWith({
      products: ["e651f46d-ac20-4f26-b769-ad088b123df2"],
      slug: "pro",
    });
  });

  it("handles subscription portal when active", async () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: {user: {name: "VIP User"}},
      isPending: false,
    });
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: true,
    });

    render(<Header />);

    fireEvent.click(screen.getByText("Subscriptions"));

    expect(authClient.customer.portal).toHaveBeenCalled();
  });

  it("toggles mobile menu", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
    });
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    render(<Header />);

    const toggleButton = screen.getByRole("button", {name: ""});
    fireEvent.click(toggleButton);
  });
});
