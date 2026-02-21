import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import {SetPasswordButton} from "@/features/profile/components/set-password-button";

jest.mock("@/features/auth/components/auth-action-button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AuthActionButton: ({children, action, ...props}: any) => (
    <button data-testid="auth-action-button" onClick={action} {...props}>
      {children}
    </button>
  ),
}));

describe("SetPasswordButton", () => {
  it("calls requestPasswordReset with correct params", async () => {
    (authClient.requestPasswordReset as jest.Mock).mockResolvedValue({});

    render(<SetPasswordButton email="test@example.com" />);

    const button = screen.getByTestId("auth-action-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(authClient.requestPasswordReset).toHaveBeenCalledWith({
        email: "test@example.com",
        redirectTo: "/reset-password",
      });
    });
  });
});

