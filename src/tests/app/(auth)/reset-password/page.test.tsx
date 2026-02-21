import {render, screen} from "@testing-library/react";

import {requireUnauth} from "@/features/auth/helpers/auth-utils";
import ResetPasswordPage, {metadata} from "@/app/(auth)/reset-password/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/auth/components/reset-password-form", () => {
  return function MockResetPasswordForm() {
    return <div data-testid="reset-password-form">Reset Password Form</div>;
  };
});

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Reset Password");
  });

  it("invokes requireUnauth before rendering", async () => {
    (requireUnauth as jest.Mock).mockResolvedValue(undefined);

    await ResetPasswordPage();

    expect(requireUnauth).toHaveBeenCalled();
  });

  it("calls requireUnauth and renders ResetPasswordForm", async () => {
    (requireUnauth as jest.Mock).mockResolvedValue(undefined);

    const result = await ResetPasswordPage();
    render(result);

    expect(requireUnauth).toHaveBeenCalled();
    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();
  });
});
