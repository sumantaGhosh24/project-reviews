import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {BackupCodeTab} from "@/features/auth/components/backup-code-tab";

describe("BackupCodeTab", () => {
  const mockRouter = {push: jest.fn()};

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders the form correctly", () => {
    render(<BackupCodeTab />);
    expect(screen.getByLabelText(/backup code/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /verify/i})).toBeInTheDocument();
  });

  it("calls authClient.twoFactor.verifyBackupCode on successful submission", async () => {
    (authClient.twoFactor.verifyBackupCode as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
      }
    );

    render(<BackupCodeTab />);

    fireEvent.change(screen.getByLabelText(/backup code/i), {
      target: {value: "12345678"},
    });
    fireEvent.click(screen.getByRole("button", {name: /verify/i}));

    await waitFor(() => {
      expect(authClient.twoFactor.verifyBackupCode).toHaveBeenCalledWith(
        {code: "12345678"},
        expect.any(Object)
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/home");
    });
  });

  it("handles verification error", async () => {
    (authClient.twoFactor.verifyBackupCode as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: "Invalid code"}});
      }
    );

    render(<BackupCodeTab />);

    fireEvent.change(screen.getByLabelText(/backup code/i), {
      target: {value: "wrong-code"},
    });
    fireEvent.click(screen.getByRole("button", {name: /verify/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid code");
    });
  });
});
