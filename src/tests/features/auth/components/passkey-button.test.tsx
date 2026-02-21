import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {useRouter} from "next/navigation";

import {authClient} from "@/lib/auth/auth-client";
import {PasskeyButton} from "@/features/auth/components/passkey-button";

jest.mock("@/features/auth/components/auth-action-button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AuthActionButton: ({children, action}: any) => (
    <button data-testid="auth-action-button" onClick={action}>
      {children}
    </button>
  ),
}));

describe("PasskeyButton", () => {
  const mockRouter = {push: jest.fn()};
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (authClient.useSession as jest.Mock).mockReturnValue({
      refetch: mockRefetch,
    });
  });

  it("calls authClient.signIn.passkey with autoFill on mount", () => {
    render(<PasskeyButton />);
    expect(authClient.signIn.passkey).toHaveBeenCalledWith(
      {autoFill: true},
      expect.any(Object)
    );
  });

  it("calls refetch and router.push on successful autoFill", async () => {
    (authClient.signIn.passkey as jest.Mock).mockImplementation(
      (data, options) => {
        if (data?.autoFill) {
          options.onSuccess();
        }
      }
    );

    render(<PasskeyButton />);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/home");
    });
  });

  it("calls authClient.signIn.passkey on button click", async () => {
    (authClient.signIn.passkey as jest.Mock).mockImplementation(
      (data, options) => {
        if (!data) {
          options.onSuccess();
        }
      }
    );

    render(<PasskeyButton />);
    fireEvent.click(screen.getByTestId("auth-action-button"));

    await waitFor(() => {
      expect(authClient.signIn.passkey).toHaveBeenCalledWith(
        undefined,
        expect.any(Object)
      );
      expect(mockRefetch).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/home");
    });
  });
});
