import {render, screen} from "@testing-library/react";

import {requireUnauth} from "@/features/auth/helpers/auth-utils";
import LoginPage, {metadata} from "@/app/(auth)/login/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/auth/components/login-form", () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form</div>;
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Login");
  });

  it("invokes requireUnauth before rendering", async () => {
    (requireUnauth as jest.Mock).mockResolvedValue(undefined);

    await LoginPage();

    expect(requireUnauth).toHaveBeenCalled();
  });

  it("calls requireUnauth and renders LoginForm", async () => {
    (requireUnauth as jest.Mock).mockResolvedValue(undefined);

    const result = await LoginPage();
    render(result);

    expect(requireUnauth).toHaveBeenCalled();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
