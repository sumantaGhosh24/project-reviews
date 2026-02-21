import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import {PasskeyManagement} from "@/features/profile/components/passkey-management";

jest.mock("@/features/auth/components/auth-action-button", () => ({
  AuthActionButton: jest.fn(({children, action}) => (
    <button onClick={action}>{children}</button>
  )),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("PasskeyManagement", () => {
  const mockRouter = {
    refresh: jest.fn(),
  };

  const mockPasskeys = [
    {id: "pk1", name: "My Passkey", createdAt: new Date().toISOString()},
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders passkeys correctly", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<PasskeyManagement passkeys={mockPasskeys as any} />);
    expect(screen.getByText("My Passkey")).toBeInTheDocument();
  });

  it("shows 'No passkeys yet' when list is empty", () => {
    render(<PasskeyManagement passkeys={[]} />);
    expect(screen.getByText(/no passkeys yet/i)).toBeInTheDocument();
  });

  it("calls addPasskey when form is submitted", async () => {
    (authClient.passkey.addPasskey as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
        return Promise.resolve();
      }
    );

    render(<PasskeyManagement passkeys={[]} />);

    fireEvent.click(screen.getByRole("button", {name: /new passkey/i}));

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: {value: "New Passkey"},
    });
    fireEvent.click(screen.getByText(/^add$/i).closest("button")!);

    await waitFor(() => {
      expect(authClient.passkey.addPasskey).toHaveBeenCalledWith(
        {name: "New Passkey"},
        expect.any(Object)
      );
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("shows error toast when addPasskey fails", async () => {
    (authClient.passkey.addPasskey as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: "Something went wrong"}});
        return Promise.resolve();
      }
    );

    render(<PasskeyManagement passkeys={[]} />);

    fireEvent.click(screen.getByRole("button", {name: /new passkey/i}));

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: {value: "My Passkey"},
    });

    fireEvent.click(screen.getByText(/^add$/i).closest("button")!);

    await waitFor(() => {
      expect(authClient.passkey.addPasskey).toHaveBeenCalledWith(
        {name: "My Passkey"},
        expect.any(Object)
      );
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });

  it("calls deletePasskey when delete button is clicked", async () => {
    (authClient.passkey.deletePasskey as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
        return Promise.resolve();
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<PasskeyManagement passkeys={mockPasskeys as any} />);

    fireEvent.click(screen.getByTestId("icon-Trash2Icon").closest("button")!);

    await waitFor(() => {
      expect(authClient.passkey.deletePasskey).toHaveBeenCalledWith(
        {id: "pk1"},
        expect.any(Object)
      );
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
});
