import {render, screen, act} from "@testing-library/react";

import {EmailVerification} from "@/features/auth/components/email-verification";

jest.mock("@/features/auth/components/auth-action-button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AuthActionButton: ({children, disabled, action}: any) => (
    <button disabled={disabled} onClick={action}>
      {children}
    </button>
  ),
}));

describe("EmailVerification", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts countdown on mount", () => {
    render(<EmailVerification email="test@example.com" />);

    expect(screen.getByText("Resend Email (30)")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText("Resend Email (29)")).toBeInTheDocument();
  });

  it("enables button when countdown reaches zero", () => {
    render(<EmailVerification email="test@example.com" />);

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(screen.getByText("Resend Email")).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("restarts countdown when button is clicked", () => {
    render(<EmailVerification email="test@example.com" />);

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    const button = screen.getByRole("button");
    act(() => {
      button.click();
    });

    expect(screen.getByText("Resend Email (30)")).toBeInTheDocument();
  });
});
