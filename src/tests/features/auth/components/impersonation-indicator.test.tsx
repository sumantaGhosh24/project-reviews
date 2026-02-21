import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {useRouter} from "next/navigation";

import {authClient} from "@/lib/auth/auth-client";
import {ImpersonationIndicator} from "@/features/auth/components/impersonation-indicator";

jest.mock("@/features/auth/components/auth-action-button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AuthActionButton: ({children, action}: any) => (
    <button data-testid="auth-action-button" onClick={action}>
      {children}
    </button>
  ),
}));

describe("ImpersonationIndicator", () => {
  const mockRouter = {push: jest.fn()};
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders null if not impersonating", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: {session: {impersonatedBy: null}},
      refetch: mockRefetch,
    });

    const {container} = render(<ImpersonationIndicator />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the indicator if impersonating", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: {session: {impersonatedBy: "admin-id"}},
      refetch: mockRefetch,
    });

    render(<ImpersonationIndicator />);
    expect(screen.getByTestId("auth-action-button")).toBeInTheDocument();
  });

  it("calls stopImpersonating when button is clicked", async () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: {session: {impersonatedBy: "admin-id"}},
      refetch: mockRefetch,
    });

    (authClient.admin.stopImpersonating as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
      }
    );

    render(<ImpersonationIndicator />);
    fireEvent.click(screen.getByTestId("auth-action-button"));

    await waitFor(() => {
      expect(authClient.admin.stopImpersonating).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/users");
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
