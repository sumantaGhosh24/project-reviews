import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import {ProfileUpdateForm} from "@/features/profile/components/profile-update-form";

describe("ProfileUpdateForm", () => {
  const mockRouter = {
    refresh: jest.fn(),
  };

  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    favoriteNumber: 42,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders with default values", () => {
    render(<ProfileUpdateForm user={mockUser} />);
    expect(screen.getByLabelText(/name/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/email/i)).toHaveValue("john@example.com");
    expect(screen.getByLabelText(/favorite number/i)).toHaveValue("42");
  });

  it("calls updateUser when form is submitted without email change", async () => {
    (authClient.updateUser as jest.Mock).mockResolvedValue({
      data: {},
      error: null,
    });
    render(<ProfileUpdateForm user={mockUser} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: {value: "Jane Doe"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /update profile/i}));

    await waitFor(() => {
      expect(authClient.updateUser).toHaveBeenCalledWith({
        name: "Jane Doe",
        favoriteNumber: 42,
      });
      expect(authClient.changeEmail).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Profile updated successfully"
      );
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("calls both updateUser and changeEmail when email is changed", async () => {
    (authClient.updateUser as jest.Mock).mockResolvedValue({
      data: {},
      error: null,
    });
    (authClient.changeEmail as jest.Mock).mockResolvedValue({
      data: {},
      error: null,
    });
    render(<ProfileUpdateForm user={mockUser} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: "jane@example.com"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /update profile/i}));

    await waitFor(() => {
      expect(authClient.updateUser).toHaveBeenCalled();
      expect(authClient.changeEmail).toHaveBeenCalledWith({
        newEmail: "jane@example.com",
        callbackURL: "/profile/edit",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Verify your new email address to complete the change."
      );
    });
  });

  it("shows error toast if updateUser fails", async () => {
    (authClient.updateUser as jest.Mock).mockResolvedValue({
      error: {message: "Update failed"},
    });
    render(<ProfileUpdateForm user={mockUser} />);

    fireEvent.submit(screen.getByRole("button", {name: /update profile/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Update failed");
    });
  });

  it("shows error toast if changeEmail fails", async () => {
    (authClient.updateUser as jest.Mock).mockResolvedValue({
      data: {},
      error: null,
    });
    (authClient.changeEmail as jest.Mock).mockResolvedValue({
      error: {message: "Email change failed"},
    });
    render(<ProfileUpdateForm user={mockUser} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: "jane@example.com"},
    });
    fireEvent.submit(screen.getByRole("button", {name: /update profile/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email change failed");
    });
  });
});
