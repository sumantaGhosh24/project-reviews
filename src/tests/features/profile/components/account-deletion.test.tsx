import {render, screen, fireEvent} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import {AccountDeletion} from "@/features/profile/components/account-deletion";

jest.mock("@/features/auth/components/auth-action-button", () => ({
  AuthActionButton: jest.fn(({children, action}) => (
    <button onClick={action}>{children}</button>
  )),
}));

describe("AccountDeletion", () => {
  it("renders correctly", () => {
    render(<AccountDeletion />);
    expect(screen.getByText(/delete account permanently/i)).toBeInTheDocument();
  });

  it("calls authClient.deleteUser when action is triggered", () => {
    render(<AccountDeletion />);
    fireEvent.click(screen.getByText(/delete account permanently/i));
    expect(authClient.deleteUser).toHaveBeenCalledWith({callbackURL: "/"});
  });
});
