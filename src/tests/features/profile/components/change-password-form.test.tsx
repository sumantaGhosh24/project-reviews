import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import {ChangePasswordForm} from "@/features/profile/components/change-password-form";

describe("ChangePasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<ChangePasswordForm />);
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/log out other sessions/i)
    ).toBeInTheDocument();
  });

  it("calls authClient.changePassword on submit", async () => {
    (authClient.changePassword as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
        return Promise.resolve();
      }
    );

    render(<ChangePasswordForm />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: {value: "old-pass"},
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: {value: "new-password"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /change password/i}));

    await waitFor(() => {
      expect(authClient.changePassword).toHaveBeenCalledWith(
        expect.objectContaining({
          currentPassword: "old-pass",
          newPassword: "new-password",
          revokeOtherSessions: true,
        }),
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Password changed successfully"
      );
    });
  });

  it("shows error toast if changePassword fails", async () => {
    (authClient.changePassword as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: "Change failed"}});
        return Promise.resolve();
      }
    );

    render(<ChangePasswordForm />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: {value: "old-pass"},
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: {value: "new-password"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /change password/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Change failed");
    });
  });
});
