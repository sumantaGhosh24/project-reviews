import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {SignUpTab} from "@/features/auth/components/sign-up-tab";

describe("SignUpTab", () => {
  const mockOpenEmailVerificationTab = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(
      <SignUpTab openEmailVerificationTab={mockOpenEmailVerificationTab} />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/favorite number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /sign up/i})).toBeInTheDocument();
  });

  it("calls authClient.signUp.email and handles unverified email", async () => {
    (authClient.signUp.email as jest.Mock).mockResolvedValue({
      error: null,
      data: {user: {emailVerified: false}},
    });

    render(
      <SignUpTab openEmailVerificationTab={mockOpenEmailVerificationTab} />
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: {value: "John Doe"},
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: "john@example.com"},
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: "password123"},
    });
    fireEvent.change(screen.getByLabelText(/favorite number/i), {
      target: {value: "42"},
    });

    fireEvent.click(screen.getByRole("button", {name: /sign up/i}));

    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          favoriteNumber: 42,
          callbackURL: "/home",
        }),
        expect.any(Object)
      );
      expect(mockOpenEmailVerificationTab).toHaveBeenCalledWith(
        "john@example.com"
      );
    });
  });

  it("shows error toast on failure", async () => {
    (authClient.signUp.email as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: "Email already exists"}});
        return {error: {message: "Email already exists"}, data: null};
      }
    );

    render(
      <SignUpTab openEmailVerificationTab={mockOpenEmailVerificationTab} />
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: {value: "John Doe"},
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: "john@example.com"},
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: "password123"},
    });
    fireEvent.change(screen.getByLabelText(/favorite number/i), {
      target: {value: "42"},
    });

    fireEvent.click(screen.getByRole("button", {name: /sign up/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email already exists");
    });
  });

  it("shows validation error for non-numeric favorite number", async () => {
    render(
      <SignUpTab openEmailVerificationTab={mockOpenEmailVerificationTab} />
    );

    fireEvent.change(screen.getByLabelText(/favorite number/i), {
      target: {value: "abc"},
    });
    fireEvent.click(screen.getByRole("button", {name: /sign up/i}));

    await waitFor(() => {
      expect(
        screen.getByText(/favorite number must be a number/i)
      ).toBeInTheDocument();
    });
  });
});
