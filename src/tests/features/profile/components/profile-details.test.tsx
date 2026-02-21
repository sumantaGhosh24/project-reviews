import {useRouter} from "next/navigation";
import {render, screen, fireEvent} from "@testing-library/react";

import {
  useHandleFollow,
  useSuspenseUser,
} from "@/features/profile/hooks/use-profile";
import ProfileDetails from "@/features/profile/components/profile-details";

jest.mock("@/features/profile/hooks/use-profile", () => ({
  useHandleFollow: jest.fn(),
  useSuspenseUser: jest.fn(),
}));

describe("ProfileDetails", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockHandleFollow = {
    mutate: jest.fn(),
  };

  const mockUser = {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    image: "https://example.com/image.png",
    projectsCount: 5,
    followersCount: 10,
    followingsCount: 8,
    isActiveUser: false,
    isFollowing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useHandleFollow as jest.Mock).mockReturnValue(mockHandleFollow);
    (useSuspenseUser as jest.Mock).mockReturnValue({
      data: mockUser,
      isFetching: false,
    });
  });

  it("renders user details correctly", () => {
    render(<ProfileDetails id="u1" />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("shows Follow button when not following and not active user", () => {
    render(<ProfileDetails id="u1" />);
    expect(screen.getByRole("button", {name: /follow/i})).toBeInTheDocument();
  });

  it("shows Unfollow button when already following", () => {
    (useSuspenseUser as jest.Mock).mockReturnValue({
      data: {...mockUser, isFollowing: true},
      isFetching: false,
    });
    render(<ProfileDetails id="u1" />);
    expect(screen.getByRole("button", {name: /unfollow/i})).toBeInTheDocument();
  });

  it("shows Edit profile button for active user", () => {
    (useSuspenseUser as jest.Mock).mockReturnValue({
      data: {...mockUser, isActiveUser: true},
      isFetching: false,
    });
    render(<ProfileDetails id="u1" />);
    expect(
      screen.getByRole("button", {name: /edit profile/i})
    ).toBeInTheDocument();
  });

  it("calls handleFollow.mutate when Follow button is clicked", () => {
    render(<ProfileDetails id="u1" />);
    fireEvent.click(screen.getByRole("button", {name: /follow/i}));
    expect(mockHandleFollow.mutate).toHaveBeenCalledWith({userId: "u1"});
  });

  it("does not call handleFollow.mutate when data is fetching", () => {
    (useSuspenseUser as jest.Mock).mockReturnValue({
      data: mockUser,
      isFetching: true,
    });

    render(<ProfileDetails id="u1" />);
    fireEvent.click(screen.getByRole("button", {name: /follow/i}));

    expect(mockHandleFollow.mutate).not.toHaveBeenCalled();
  });

  it("calls router.push when Edit profile button is clicked", () => {
    (useSuspenseUser as jest.Mock).mockReturnValue({
      data: {...mockUser, isActiveUser: true},
      isFetching: false,
    });
    render(<ProfileDetails id="u1" />);
    fireEvent.click(screen.getByRole("button", {name: /edit profile/i}));
    expect(mockRouter.push).toHaveBeenCalledWith("/profile/edit");
  });
});
