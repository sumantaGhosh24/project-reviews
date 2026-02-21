/* eslint-disable @typescript-eslint/no-explicit-any */
import {useRouter} from "next/navigation";
import {render, screen, fireEvent} from "@testing-library/react";

import {useHandleFollow} from "@/features/profile/hooks/use-profile";
import UserCard from "@/features/profile/components/user-card";

jest.mock("@/features/profile/hooks/use-profile", () => ({
  useHandleFollow: jest.fn(),
}));

describe("UserCard", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockHandleFollow = {
    mutate: jest.fn(),
  };

  const mockUser = {
    id: "u1",
    name: "Jane Smith",
    email: "jane@example.com",
    image: "https://example.com/jane.png",
    isActiveUser: false,
    isFollowing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useHandleFollow as jest.Mock).mockReturnValue(mockHandleFollow);
  });

  it("renders user name and email", () => {
    render(<UserCard user={mockUser as any} />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("shows Follow button when not following and not active user", () => {
    render(<UserCard user={mockUser as any} />);
    expect(screen.getByRole("button", {name: /follow/i})).toBeInTheDocument();
  });

  it("shows Unfollow button when already following", () => {
    render(<UserCard user={{...mockUser, isFollowing: true} as any} />);
    expect(screen.getByRole("button", {name: /unfollow/i})).toBeInTheDocument();
  });

  it("does not show follow/unfollow button for active user", () => {
    render(<UserCard user={{...mockUser, isActiveUser: true} as any} />);
    expect(
      screen.queryByRole("button", {name: /follow/i})
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {name: /unfollow/i})
    ).not.toBeInTheDocument();
  });

  it("calls handleFollow.mutate when follow button is clicked", () => {
    render(<UserCard user={mockUser as any} />);
    fireEvent.click(screen.getByRole("button", {name: /follow/i}));
    expect(mockHandleFollow.mutate).toHaveBeenCalledWith({userId: "u1"});
  });

  it("calls router.push when View button is clicked", () => {
    render(<UserCard user={mockUser as any} />);
    fireEvent.click(screen.getByRole("button", {name: /view/i}));
    expect(mockRouter.push).toHaveBeenCalledWith("/profile/u1/details");
  });
});
