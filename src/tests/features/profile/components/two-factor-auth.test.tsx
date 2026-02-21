import {useRouter} from "next/navigation";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {TwoFactorAuth} from "@/features/profile/components/two-factor-auth";

jest.mock("react-qr-code", () => {
  return function MockQRCode() {
    return <div data-testid="qr-code" />;
  };
});

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("TwoFactorAuth", () => {
  const mockRouter = {
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders enable form when 2FA is disabled", () => {
    render(<TwoFactorAuth isEnabled={false} />);
    expect(
      screen.getByRole("button", {name: /enable 2fa/i})
    ).toBeInTheDocument();
  });

  it("renders disable form when 2FA is enabled", () => {
    render(<TwoFactorAuth isEnabled={true} />);
    expect(
      screen.getByRole("button", {name: /disable 2fa/i})
    ).toBeInTheDocument();
  });

  it("calls enable, verifies TOTP and shows backup codes", async () => {
    const mockData = {totpURI: "otpauth://...", backupCodes: ["code1"]};
    (authClient.twoFactor.enable as jest.Mock).mockResolvedValue({
      data: mockData,
      error: null,
    });
    (authClient.twoFactor.verifyTotp as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
        return Promise.resolve();
      }
    );

    render(<TwoFactorAuth isEnabled={false} />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: "pass"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /enable 2fa/i}));

    await waitFor(() => {
      expect(authClient.twoFactor.enable).toHaveBeenCalledWith({
        password: "pass",
      });
      expect(screen.getByTestId("qr-code")).toBeInTheDocument();
      expect(screen.getByLabelText(/code/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/code/i), {
      target: {value: "123456"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /submit code/i}));

    await waitFor(() => {
      expect(authClient.twoFactor.verifyTotp).toHaveBeenCalledWith(
        {code: "123456"},
        expect.any(Object)
      );
      expect(screen.getByText("code1")).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /done/i})).toBeInTheDocument();
    });
  });

  it("calls disable on form submission when enabled", async () => {
    (authClient.twoFactor.disable as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
        return Promise.resolve();
      }
    );

    render(<TwoFactorAuth isEnabled={true} />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: "pass"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /disable 2fa/i}));

    await waitFor(() => {
      expect(authClient.twoFactor.disable).toHaveBeenCalledWith(
        {password: "pass"},
        expect.any(Object)
      );
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("shows error toast when disabling 2FA fails", async () => {
    (authClient.twoFactor.disable as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: "Failed to disable 2FA"}});
        return Promise.resolve();
      }
    );

    render(<TwoFactorAuth isEnabled={true} />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: "pass"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /disable 2fa/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to disable 2FA");
    });
  });

  it("shows error toast when enabling 2FA fails", async () => {
    (authClient.twoFactor.enable as jest.Mock).mockResolvedValue({
      data: null,
      error: {message: "Failed to enable 2FA"},
    });

    render(<TwoFactorAuth isEnabled={false} />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: "pass"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /enable 2fa/i}));

    await waitFor(() => {
      expect(authClient.twoFactor.enable).toHaveBeenCalledWith({
        password: "pass",
      });
      expect(toast.error).toHaveBeenCalledWith("Failed to enable 2FA");
    });
  });

  it("resets twoFactorData when Done is clicked after successful verification", async () => {
    const mockData = {totpURI: "otpauth://...", backupCodes: ["code1"]};
    (authClient.twoFactor.enable as jest.Mock).mockResolvedValue({
      data: mockData,
      error: null,
    });
    (authClient.twoFactor.verifyTotp as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
        return Promise.resolve();
      }
    );

    render(<TwoFactorAuth isEnabled={false} />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: "pass"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /enable 2fa/i}));

    await waitFor(() => {
      expect(screen.getByTestId("qr-code")).toBeInTheDocument();
      expect(screen.getByLabelText(/code/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/code/i), {
      target: {value: "123456"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /submit code/i}));

    await waitFor(() => {
      expect(screen.getByText("code1")).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /done/i})).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", {name: /done/i}));

    await waitFor(() => {
      expect(
        screen.getByRole("button", {name: /enable 2fa/i})
      ).toBeInTheDocument();
    });
  });

  it("shows error toast when TOTP verification fails", async () => {
    const mockData = {totpURI: "otpauth://...", backupCodes: ["code1"]};
    (authClient.twoFactor.enable as jest.Mock).mockResolvedValue({
      data: mockData,
      error: null,
    });
    (authClient.twoFactor.verifyTotp as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: "Failed to verify code"}});
        return Promise.resolve();
      }
    );

    render(<TwoFactorAuth isEnabled={false} />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: "pass"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /enable 2fa/i}));

    await waitFor(() => {
      expect(screen.getByTestId("qr-code")).toBeInTheDocument();
      expect(screen.getByLabelText(/code/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/code/i), {
      target: {value: "123456"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /submit code/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to verify code");
    });
  });
});
