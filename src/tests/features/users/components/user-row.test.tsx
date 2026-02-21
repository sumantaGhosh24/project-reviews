/* eslint-disable @typescript-eslint/no-explicit-any */
import {axe} from "jest-axe";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {render, screen, fireEvent} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import {UserRow} from "@/features/users/components/user-row";

describe("UserRow", () => {
  const mockRefetch = jest.fn();
  const mockRouter = {push: jest.fn(), refresh: jest.fn()};
  const mockUser = {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    banned: false,
    emailVerified: true,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authClient.useSession as jest.Mock).mockReturnValue({
      refetch: mockRefetch,
    });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("should have no accessibility violations", async () => {
    const {container} = render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders correctly", () => {
    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("user")).toBeInTheDocument();
  });

  it("renders 'No name' if user has no name", () => {
    const namelessUser = {...mockUser, name: null};
    render(
      <table>
        <tbody>
          <UserRow user={namelessUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    expect(screen.getByText("No name")).toBeInTheDocument();
  });

  it("renders correctly with admin role", () => {
    const adminUser = {...mockUser, role: "admin"};
    render(
      <table>
        <tbody>
          <UserRow user={adminUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    const roleBadge = screen.getByText("admin");
    expect(roleBadge).toBeInTheDocument();
    expect(roleBadge).toHaveClass("bg-primary");
  });

  it("shows 'You' badge if it is self", () => {
    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="user-123" />
        </tbody>
      </table>
    );

    expect(screen.getByText(/You/i)).toBeInTheDocument();
  });

  it("shows 'Banned' badge if user is banned", () => {
    const bannedUser = {...mockUser, banned: true};
    render(
      <table>
        <tbody>
          <UserRow user={bannedUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    expect(screen.getByText(/Banned/i)).toBeInTheDocument();
    expect(screen.getByText(/Unban User/i)).toBeInTheDocument();
  });

  it("shows 'Unverified' badge if email is not verified", () => {
    const unverifiedUser = {...mockUser, emailVerified: false};
    render(
      <table>
        <tbody>
          <UserRow user={unverifiedUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    expect(screen.getByText(/Unverified/i)).toBeInTheDocument();
  });

  it("calls impersonateUser on click", async () => {
    (authClient.admin.impersonateUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Impersonate"));

    expect(authClient.admin.impersonateUser).toHaveBeenCalledWith(
      {userId: mockUser.id},
      expect.any(Object)
    );
    expect(mockRefetch).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/home");
  });

  it("calls banUser on click", async () => {
    (authClient.admin.banUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Ban User"));

    expect(authClient.admin.banUser).toHaveBeenCalledWith(
      {userId: mockUser.id},
      expect.any(Object)
    );
    expect(toast.success).toHaveBeenCalledWith("User banned");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("calls unbanUser on click", async () => {
    (authClient.admin.unbanUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
      }
    );

    const bannedUser = {...mockUser, banned: true};
    render(
      <table>
        <tbody>
          <UserRow user={bannedUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Unban User"));

    expect(authClient.admin.unbanUser).toHaveBeenCalledWith(
      {userId: mockUser.id},
      expect.any(Object)
    );
    expect(toast.success).toHaveBeenCalledWith("User unbanned");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("calls revokeUserSessions on click", async () => {
    (authClient.admin.revokeUserSessions as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Revoke Sessions"));

    expect(authClient.admin.revokeUserSessions).toHaveBeenCalledWith(
      {userId: mockUser.id},
      expect.any(Object)
    );
    expect(toast.success).toHaveBeenCalledWith("User sessions revoked");
  });

  it("calls removeUser on confirm delete", async () => {
    (authClient.admin.removeUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByTestId("alert-dialog-action"));

    expect(authClient.admin.removeUser).toHaveBeenCalledWith(
      {userId: mockUser.id},
      expect.any(Object)
    );
    expect(toast.success).toHaveBeenCalledWith("User deleted");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("handles errors in impersonateUser", async () => {
    const errorMessage = "Impersonation failed";
    (authClient.admin.impersonateUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: errorMessage}});
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Impersonate"));

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it("handles errors with fallback message in impersonateUser", async () => {
    (authClient.admin.impersonateUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: ""}});
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Impersonate"));

    expect(toast.error).toHaveBeenCalledWith("Failed to impersonate");
  });

  it("handles errors in banUser", async () => {
    const errorMessage = "Ban failed";
    (authClient.admin.banUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: errorMessage}});
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Ban User"));

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it("handles errors with fallback message in banUser", async () => {
    (authClient.admin.banUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: ""}});
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Ban User"));

    expect(toast.error).toHaveBeenCalledWith("Failed to ban user");
  });

  it("handles errors in unbanUser", async () => {
    const errorMessage = "Unban failed";
    (authClient.admin.unbanUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: errorMessage}});
      }
    );

    const bannedUser = {...mockUser, banned: true};
    render(
      <table>
        <tbody>
          <UserRow user={bannedUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Unban User"));

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it("handles errors with fallback message in unbanUser", async () => {
    (authClient.admin.unbanUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: ""}});
      }
    );

    const bannedUser = {...mockUser, banned: true};
    render(
      <table>
        <tbody>
          <UserRow user={bannedUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Unban User"));

    expect(toast.error).toHaveBeenCalledWith("Failed to unban user");
  });

  it("handles errors in revokeUserSessions", async () => {
    const errorMessage = "Revoke failed";
    (authClient.admin.revokeUserSessions as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: errorMessage}});
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Revoke Sessions"));

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it("handles errors with fallback message in revokeUserSessions", async () => {
    (authClient.admin.revokeUserSessions as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: ""}});
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Revoke Sessions"));

    expect(toast.error).toHaveBeenCalledWith("Failed to revoke user sessions");
  });

  it("handles errors in removeUser", async () => {
    const errorMessage = "Delete failed";
    (authClient.admin.removeUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: errorMessage}});
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByTestId("alert-dialog-action"));

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it("handles errors with fallback message in removeUser", async () => {
    (authClient.admin.removeUser as jest.Mock).mockImplementation(
      (data, options) => {
        options.onError({error: {message: ""}});
      }
    );

    render(
      <table>
        <tbody>
          <UserRow user={mockUser as any} selfId="self-123" />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByTestId("alert-dialog-action"));

    expect(toast.error).toHaveBeenCalledWith("Failed to delete user");
  });
});
