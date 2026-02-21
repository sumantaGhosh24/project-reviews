import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 'Invalid Reset Link' if token is missing", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === "token" ? null : null),
    });

    render(<ResetPasswordForm />);

    expect(screen.getByText("Invalid Reset Link")).toBeInTheDocument();
    expect(
      screen.getByText("The password reset link is invalid or has expired.")
    ).toBeInTheDocument();
  });

  it("renders 'Invalid Reset Link' if error is present", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === "token") return "valid-token";
        if (key === "error") return "some-error";
        return null;
      },
    });

    render(<ResetPasswordForm />);

    expect(screen.getByText("Invalid Reset Link")).toBeInTheDocument();
  });

  it("renders reset password form if token is present and no error", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === "token" ? "valid-token" : null),
    });

    render(<ResetPasswordForm />);

    expect(screen.getByText("Reset Your Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
  });

  it("calls resetPassword and shows success toast on successful reset", async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({push: mockPush});
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === "token" ? "valid-token" : null),
    });

    (authClient.resetPassword as unknown as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
        return Promise.resolve();
      }
    );

    jest.useFakeTimers();

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: {value: "new-password"},
    });

    fireEvent.submit(screen.getByRole("button", {name: /reset password/i}));

    await waitFor(() => {
      expect(authClient.resetPassword).toHaveBeenCalledWith(
        {
          newPassword: "new-password",
          token: "valid-token",
        },
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith("Password reset successful", {
        description: "Redirection to login...",
      });
    });

    jest.runAllTimers();

    expect(mockPush).toHaveBeenCalledWith("/login");

    jest.useRealTimers();
  });

  it("shows error toast when resetPassword fails", async () => {
    (useRouter as jest.Mock).mockReturnValue({push: jest.fn()});
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === "token" ? "valid-token" : null),
    });

    (authClient.resetPassword as unknown as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: "Reset failed"}});
        return Promise.resolve();
      }
    );

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: {value: "new-password"},
    });

    fireEvent.submit(screen.getByRole("button", {name: /reset password/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Reset failed");
    });
  });
});
