import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {AuthActionButton} from "@/features/auth/components/auth-action-button";

jest.mock("@/components/action-button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ActionButton: ({action, children, ...props}: any) => (
    <button onClick={action} {...props}>
      {children}
    </button>
  ),
}));

describe("AuthActionButton", () => {
  const mockAction = jest.fn();
  const successMessage = "Success!";

  beforeEach(() => {
    mockAction.mockClear();
  });

  it("handles successful action", async () => {
    mockAction.mockResolvedValue({error: null});
    render(
      <AuthActionButton action={mockAction} successMessage={successMessage}>
        Click Me
      </AuthActionButton>
    );

    const button = screen.getByText("Click Me");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });
  });

  it("handles action with error", async () => {
    mockAction.mockResolvedValue({error: {message: "Failed"}});
    render(
      <AuthActionButton action={mockAction} successMessage={successMessage}>
        Click Me
      </AuthActionButton>
    );

    const button = screen.getByText("Click Me");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });
  });
});
