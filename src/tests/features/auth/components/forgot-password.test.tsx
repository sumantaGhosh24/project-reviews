import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {ForgotPassword} from "@/features/auth/components/forgot-password";

describe("ForgotPassword", () => {
  const mockOpenSignInTab = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<ForgotPassword openSignInTab={mockOpenSignInTab} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {name: /send reset email/i})
    ).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /back/i})).toBeInTheDocument();
  });

  it("calls openSignInTab when Back button is clicked", () => {
    render(<ForgotPassword openSignInTab={mockOpenSignInTab} />);

    fireEvent.click(screen.getByRole("button", {name: /back/i}));
    expect(mockOpenSignInTab).toHaveBeenCalled();
  });

  it("shows validation error for invalid email", async () => {
    const {container} = render(
      <ForgotPassword openSignInTab={mockOpenSignInTab} />
    );

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, {target: {value: "invalid-email"}});
    fireEvent.submit(container.querySelector("form")!);

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it("calls requestPasswordReset on successful submission", async () => {
    (authClient.requestPasswordReset as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
      }
    );

    render(<ForgotPassword openSignInTab={mockOpenSignInTab} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: "test@example.com"},
    });
    fireEvent.click(screen.getByRole("button", {name: /send reset email/i}));

    await waitFor(() => {
      expect(authClient.requestPasswordReset).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          redirectTo: "/reset-password",
        }),
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith("Password reset email sent");
    });
  });

  it("shows error toast on failure", async () => {
    (authClient.requestPasswordReset as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: "User not found"}});
      }
    );

    render(<ForgotPassword openSignInTab={mockOpenSignInTab} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: "test@example.com"},
    });
    fireEvent.click(screen.getByRole("button", {name: /send reset email/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("User not found");
    });
  });
});
