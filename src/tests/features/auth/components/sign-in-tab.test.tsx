import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {SignInTab} from "@/features/auth/components/sign-in-tab";

jest.mock("@/features/auth/components/passkey-button", () => ({
  PasskeyButton: () => <button data-testid="passkey-button">Passkey</button>,
}));

describe("SignInTab", () => {
  const mockRouter = {push: jest.fn()};
  const mockOpenEmailVerificationTab = jest.fn();
  const mockOpenForgotPassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders the form correctly", () => {
    render(
      <SignInTab
        openEmailVerificationTab={mockOpenEmailVerificationTab}
        openForgotPassword={mockOpenForgotPassword}
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /sign in/i})).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
    expect(screen.getByTestId("passkey-button")).toBeInTheDocument();
  });

  it("calls openForgotPassword when Forgot password? link is clicked", () => {
    render(
      <SignInTab
        openEmailVerificationTab={mockOpenEmailVerificationTab}
        openForgotPassword={mockOpenForgotPassword}
      />
    );

    fireEvent.click(screen.getByText(/forgot password\?/i));
    expect(mockOpenForgotPassword).toHaveBeenCalled();
  });

  it("calls authClient.signIn.email on successful submission", async () => {
    (authClient.signIn.email as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
      }
    );

    render(
      <SignInTab
        openEmailVerificationTab={mockOpenEmailVerificationTab}
        openForgotPassword={mockOpenForgotPassword}
      />
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: "test@example.com"},
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: "password123"},
    });
    fireEvent.click(screen.getByRole("button", {name: /sign in/i}));

    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          password: "password123",
          callbackURL: "/home",
        }),
        expect.any(Object)
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/home");
    });
  });

  it("handles EMAIL_NOT_VERIFIED error", async () => {
    (authClient.signIn.email as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({
          error: {code: "EMAIL_NOT_VERIFIED", message: "Verify email"},
        });
      }
    );

    render(
      <SignInTab
        openEmailVerificationTab={mockOpenEmailVerificationTab}
        openForgotPassword={mockOpenForgotPassword}
      />
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: "test@example.com"},
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: "password123"},
    });
    fireEvent.click(screen.getByRole("button", {name: /sign in/i}));

    await waitFor(() => {
      expect(mockOpenEmailVerificationTab).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(toast.error).toHaveBeenCalledWith("Verify email");
    });
  });
});
