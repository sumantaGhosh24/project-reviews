/* eslint-disable @typescript-eslint/no-explicit-any */
import {render, screen} from "@testing-library/react";
import {headers} from "next/headers";

import {auth} from "@/lib/auth/auth";
import {polarClient} from "@/lib/polar";
import ProfilePage, {
  metadata,
  LinkedAccountsTab,
  SessionsTab,
  SecurityTab,
  LoadingSuspense,
} from "@/app/profile/edit/page";

jest.mock("@/features/auth/helpers/auth-utils", () => ({
  requireAuth: jest.fn(),
}));
jest.mock("@/features/profile/components/profile-update-form", () => ({
  ProfileUpdateForm: () => <div data-testid="profile-form" />,
}));
jest.mock("@/features/profile/components/account-linking", () => ({
  AccountLinking: ({currentAccounts}: any) => (
    <div data-testid="account-linking">{currentAccounts.length} accounts</div>
  ),
}));
jest.mock("@/features/profile/components/session-management", () => ({
  SessionManagement: ({sessions}: any) => (
    <div data-testid="session-management">{sessions.length} sessions</div>
  ),
}));
jest.mock("@/features/profile/components/change-password-form", () => ({
  ChangePasswordForm: () => <div data-testid="change-password-form" />,
}));
jest.mock("@/features/profile/components/set-password-button", () => ({
  SetPasswordButton: () => <div data-testid="set-password-button" />,
}));
jest.mock("@/features/profile/components/two-factor-auth", () => ({
  TwoFactorAuth: () => <div data-testid="two-factor-auth" />,
}));
jest.mock("@/features/profile/components/passkey-management", () => ({
  PasskeyManagement: () => <div data-testid="passkey-management" />,
}));

describe("Profile Edit Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
      user: mockUser,
      session: {token: "token-1"},
    });
    (polarClient.customers.getStateExternal as jest.Mock).mockResolvedValue({
      activeSubscriptions: [],
    });
    (headers as jest.Mock).mockResolvedValue({});
  });

  const mockUser = {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    role: "user",
    image: "https://example.com/image.png",
  };

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Update Profile");
  });

  it("renders profile edit page with tabs", async () => {
    const Result = await ProfilePage();
    render(Result);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Sessions")).toBeInTheDocument();
    expect(screen.getByText("Accounts")).toBeInTheDocument();
  });

  describe("Sub-tabs", () => {
    it("renders LinkedAccountsTab with filtered accounts", async () => {
      (auth.api.listUserAccounts as unknown as jest.Mock).mockResolvedValue([
        {providerId: "credential"},
        {providerId: "github"},
      ]);

      const Result = await LinkedAccountsTab();
      render(Result);

      expect(screen.getByTestId("account-linking")).toHaveTextContent(
        "1 accounts"
      );
    });

    it("renders SessionsTab with sessions list", async () => {
      (auth.api.listSessions as unknown as jest.Mock).mockResolvedValue([
        {id: "s1"},
        {id: "s2"},
      ]);

      const Result = await SessionsTab({currentSessionToken: "token-1"});
      render(Result);

      expect(screen.getByTestId("session-management")).toHaveTextContent(
        "2 sessions"
      );
    });

    it("renders SecurityTab with change password form if credential account exists", async () => {
      (auth.api.listPasskeys as unknown as jest.Mock).mockResolvedValue([]);
      (auth.api.listUserAccounts as unknown as jest.Mock).mockResolvedValue([
        {providerId: "credential"},
      ]);

      const Result = await SecurityTab({
        email: "test@example.com",
        isTwoFactorEnabled: false,
      });
      render(Result);

      expect(screen.getByTestId("change-password-form")).toBeInTheDocument();
    });

    it("renders SecurityTab with set password button if no credential account", async () => {
      (auth.api.listPasskeys as unknown as jest.Mock).mockResolvedValue([]);
      (auth.api.listUserAccounts as unknown as jest.Mock).mockResolvedValue([
        {providerId: "github"},
      ]);

      const Result = await SecurityTab({
        email: "test@example.com",
        isTwoFactorEnabled: false,
      });
      render(Result);

      expect(screen.getByTestId("set-password-button")).toBeInTheDocument();
    });

    it("renders LoadingSuspense children", () => {
      render(
        <LoadingSuspense>
          <div data-testid="test-child" />
        </LoadingSuspense>
      );
      expect(screen.getByTestId("test-child")).toBeInTheDocument();
    });
  });
});
