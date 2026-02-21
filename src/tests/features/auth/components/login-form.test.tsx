import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {useRouter} from "next/navigation";

import {authClient} from "@/lib/auth/auth-client";
import LoginForm from "@/features/auth/components/login-form";

jest.mock("@/features/auth/components/social-auth-buttons", () => ({
  SocialAuthButtons: () => <div data-testid="social-auth-buttons" />,
}));
jest.mock("@/features/auth/components/sign-up-tab", () => ({
  SignUpTab: ({
    openEmailVerificationTab,
  }: {
    openEmailVerificationTab: (email: string) => void;
  }) => (
    <div data-testid="sign-up-tab">
      <button onClick={() => openEmailVerificationTab("test@example.com")}>
        Verify Email
      </button>
    </div>
  ),
}));
jest.mock("@/features/auth/components/sign-in-tab", () => ({
  SignInTab: ({
    openEmailVerificationTab,
    openForgotPassword,
  }: {
    openEmailVerificationTab: (email: string) => void;
    openForgotPassword: () => void;
  }) => (
    <div data-testid="sign-in-tab">
      <button onClick={() => openEmailVerificationTab("test@example.com")}>
        Verify Email
      </button>
      <button onClick={openForgotPassword}>Forgot Password</button>
    </div>
  ),
}));
jest.mock("@/features/auth/components/email-verification", () => ({
  EmailVerification: ({email}: {email: string}) => (
    <div data-testid="email-verification">{email}</div>
  ),
}));
jest.mock("@/features/auth/components/forgot-password", () => ({
  ForgotPassword: ({openSignInTab}: {openSignInTab: () => void}) => (
    <div data-testid="forgot-password">
      <button onClick={openSignInTab}>Back to Sign In</button>
    </div>
  ),
}));

describe("LoginForm", () => {
  const mockRouter = {push: jest.fn()};

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (authClient.getSession as jest.Mock).mockResolvedValue({data: null});
  });

  it("redirects to home if session exists", async () => {
    (authClient.getSession as jest.Mock).mockResolvedValue({data: {user: {}}});
    render(<LoginForm />);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  it("renders sign in tab by default", () => {
    render(<LoginForm />);
    expect(screen.getByTestId("sign-in-tab")).toBeInTheDocument();
    expect(screen.getByRole("tab", {name: /sign in/i})).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("switches to sign up tab when clicked", () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("tab", {name: /sign up/i}));
    expect(screen.getByTestId("sign-up-tab")).toBeInTheDocument();
  });

  it("switches to email verification tab when triggered from sign in", () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/verify email/i));
    expect(screen.getByTestId("email-verification")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("switches to forgot password tab when triggered from sign in", () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/forgot password/i));
    expect(screen.getByTestId("forgot-password")).toBeInTheDocument();
  });

  it("switches back to sign in tab from forgot password", () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/forgot password/i));
    fireEvent.click(screen.getByText(/back to sign in/i));
    expect(screen.getByTestId("sign-in-tab")).toBeInTheDocument();
  });
});
