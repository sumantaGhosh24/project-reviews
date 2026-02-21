import {render, screen} from "@testing-library/react";

import {requireUnauth} from "@/features/auth/helpers/auth-utils";
import TwoFactorPage, {metadata} from "@/app/(auth)/2fa/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/auth/components/totp-form", () => ({
  TotpForm: () => <div data-testid="totp-form">Totp Form</div>,
}));
jest.mock("@/features/auth/components/backup-code-tab", () => ({
  BackupCodeTab: () => <div data-testid="backup-code-tab">Backup Code Tab</div>,
}));

describe("TwoFactorPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Two-Factor Authentication");
  });

  it("invokes requireUnauth before rendering", async () => {
    (requireUnauth as jest.Mock).mockResolvedValue(undefined);

    await TwoFactorPage();

    expect(requireUnauth).toHaveBeenCalled();
  });

  it("renders 2FA forms if no session", async () => {
    (requireUnauth as jest.Mock).mockResolvedValue(undefined);

    const result = await TwoFactorPage();
    render(result);

    expect(requireUnauth).toHaveBeenCalled();
    expect(screen.getByText("Two-Factor Authentication")).toBeInTheDocument();
    expect(screen.getByTestId("totp-form")).toBeInTheDocument();
    expect(screen.getByText("Backup Code")).toBeInTheDocument();
  });
});
