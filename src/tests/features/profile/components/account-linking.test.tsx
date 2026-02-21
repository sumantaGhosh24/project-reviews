import {useRouter} from "next/navigation";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import {AccountLinking} from "@/features/profile/components/account-linking";

jest.mock("@/features/auth/components/auth-action-button", () => ({
  AuthActionButton: jest.fn(
    ({children, action}: {children: React.ReactNode; action: () => void}) => (
      <button onClick={action}>{children}</button>
    )
  ),
}));

jest.mock("@/lib/auth/o-auth-providers", () => ({
  SUPPORTED_OAUTH_PROVIDERS: ["github"],
  SUPPORTED_OAUTH_PROVIDER_DETAILS: {
    github: {
      name: "GitHub",
      Icon: () => <span data-testid="github-icon" />,
    },
  },
}));

describe("AccountLinking", () => {
  const mockRouter = {
    refresh: jest.fn(),
  };

  const mockAccount = {
    id: "acc1",
    providerId: "github",
    accountId: "github-123",
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders linked and linkable accounts", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <AccountLinking currentAccounts={[mockAccount as any]} />
    );

    expect(screen.getByText("Linked Accounts")).toBeInTheDocument();
    expect(screen.getByText("Link Other Accounts")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("calls unlinkAccount and refreshes router on success", async () => {
    (authClient.unlinkAccount as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
        return Promise.resolve();
      }
    );

    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <AccountLinking currentAccounts={[mockAccount as any]} />
    );

    fireEvent.click(screen.getByRole("button", {name: /unlink/i}));

    await waitFor(() => {
      expect(authClient.unlinkAccount).toHaveBeenCalledWith(
        {
          accountId: "github-123",
          providerId: "github",
        },
        expect.any(Object)
      );
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("calls linkAccount when Link button is clicked", async () => {
    (authClient.linkSocial as jest.Mock).mockResolvedValue(undefined);

    render(<AccountLinking currentAccounts={[]} />);

    fireEvent.click(screen.getByRole("button", {name: /link/i}));

    await waitFor(() => {
      expect(authClient.linkSocial).toHaveBeenCalledWith({
        provider: "github",
        callbackURL: "/profile/edit",
      });
    });
  });
});
