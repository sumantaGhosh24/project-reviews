import {render, screen} from "@testing-library/react";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {auth} from "@/lib/auth/auth";
import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import ManageUsers, {metadata} from "@/app/users/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/users/components/user-row", () => ({
  UserRow: ({user}: {user: {name: string}}) => (
    <tr data-testid="user-row">{user.name}</tr>
  ),
}));

describe("ManageUsers Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Manage Users");
  });

  it("redirects to login if no session", async () => {
    (requireAdmin as jest.Mock).mockResolvedValue(undefined);
    (headers as unknown as jest.Mock).mockResolvedValue({});
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(null);

    await ManageUsers();

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("redirects to home if no access", async () => {
    (requireAdmin as jest.Mock).mockResolvedValue(undefined);
    (headers as jest.Mock).mockResolvedValue({});
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
      user: {id: "1"},
    });
    (auth.api.userHasPermission as unknown as jest.Mock).mockResolvedValue({
      success: false,
    });

    await ManageUsers();

    expect(redirect).toHaveBeenCalledWith("/home");
  });

  it("renders users list if has access", async () => {
    (requireAdmin as jest.Mock).mockResolvedValue(undefined);
    (headers as jest.Mock).mockResolvedValue({});
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
      user: {id: "1"},
    });
    (auth.api.userHasPermission as unknown as jest.Mock).mockResolvedValue({
      success: true,
    });
    (auth.api.listUsers as unknown as jest.Mock).mockResolvedValue({
      total: 1,
      users: [{id: "2", name: "Test User"}],
    });

    const result = await ManageUsers();
    render(result);

    expect(screen.getByText("Users (1)")).toBeInTheDocument();
    expect(screen.getByTestId("user-row")).toHaveTextContent("Test User");
  });
});
