import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {TotpForm} from "@/features/auth/components/totp-form";

describe("TotpForm", () => {
  const mockRouter = {push: jest.fn()};

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders the form correctly", () => {
    render(<TotpForm />);
    expect(screen.getByLabelText(/code/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /verify/i})).toBeInTheDocument();
  });

  it("calls authClient.twoFactor.verifyTotp on successful submission", async () => {
    (authClient.twoFactor.verifyTotp as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
      }
    );

    render(<TotpForm />);

    fireEvent.change(screen.getByLabelText(/code/i), {
      target: {value: "123456"},
    });
    fireEvent.click(screen.getByRole("button", {name: /verify/i}));

    await waitFor(() => {
      expect(authClient.twoFactor.verifyTotp).toHaveBeenCalledWith(
        {code: "123456"},
        expect.any(Object)
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/home");
    });
  });

  it("handles verification error", async () => {
    (authClient.twoFactor.verifyTotp as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: "Invalid code"}});
      }
    );

    render(<TotpForm />);

    fireEvent.change(screen.getByLabelText(/code/i), {
      target: {value: "000000"},
    });
    fireEvent.click(screen.getByRole("button", {name: /verify/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid code");
    });
  });

  it("shows validation error for invalid code length", async () => {
    render(<TotpForm />);

    fireEvent.change(screen.getByLabelText(/code/i), {
      target: {value: "123"},
    });
    fireEvent.click(screen.getByRole("button", {name: /verify/i}));

    await waitFor(() => {
      expect(
        screen.getByText(/expected string to have >=6 characters/i)
      ).toBeInTheDocument();
    });
  });
});
