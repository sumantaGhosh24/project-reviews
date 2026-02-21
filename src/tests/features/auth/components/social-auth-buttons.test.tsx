import {render, screen} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
} from "@/lib/auth/o-auth-providers";
import {SocialAuthButtons} from "@/features/auth/components/social-auth-buttons";

jest.mock("@/features/auth/components/auth-action-button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AuthActionButton: ({children, action}: any) => (
    <button onClick={action}>{children}</button>
  ),
}));

describe("SocialAuthButtons", () => {
  it("renders buttons for all supported providers", () => {
    render(<SocialAuthButtons />);

    SUPPORTED_OAUTH_PROVIDERS.forEach((provider) => {
      const name = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name;
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("calls authClient.signIn.social when a button is clicked", () => {
    render(<SocialAuthButtons />);

    SUPPORTED_OAUTH_PROVIDERS.forEach((provider) => {
      const name = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name;
      const button = screen.getByText(name);
      button.click();

      expect(authClient.signIn.social).toHaveBeenCalledWith({
        provider,
        callbackURL: "/home",
      });
    });
  });
});
