import {render, screen, fireEvent} from "@testing-library/react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useSuspenseFollowers} from "@/features/profile/hooks/use-profile";
import ProfileFollowersTable from "@/features/profile/components/profile-followers-table";

jest.mock("@/features/profile/hooks/use-profile", () => ({
  useSuspenseFollowers: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/profile/components/user-card", () => {
  return function MockUserCard({user}: {user: {name: string}}) {
    return <div data-testid="user-card">{user.name}</div>;
  };
});

describe("ProfileFollowersTable", () => {
  const mockId = "user-123";
  const mockParams = {page: 1};
  const setParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalParams as jest.Mock).mockReturnValue([mockParams, setParams]);
  });

  it("renders followers correctly", () => {
    const mockFollowers = {
      items: [
        {id: "f1", name: "Follower 1"},
        {id: "f2", name: "Follower 2"},
      ],
      totalPages: 1,
      page: 1,
    };
    (useSuspenseFollowers as jest.Mock).mockReturnValue({
      data: mockFollowers,
      isFetching: false,
    });

    render(<ProfileFollowersTable id={mockId} />);

    expect(screen.getAllByTestId("user-card")).toHaveLength(2);
    expect(screen.getByText("Follower 1")).toBeInTheDocument();
    expect(screen.getByText("Follower 2")).toBeInTheDocument();
  });

  it("renders empty component when no followers", () => {
    const mockFollowers = {
      items: [],
      totalPages: 0,
      page: 1,
    };
    (useSuspenseFollowers as jest.Mock).mockReturnValue({
      data: mockFollowers,
      isFetching: false,
    });

    render(<ProfileFollowersTable id={mockId} />);

    expect(screen.getByText(/no followers found/i)).toBeInTheDocument();
  });

  it("renders pagination when multiple pages exist", () => {
    const mockFollowers = {
      items: [{id: "f1", name: "Follower 1"}],
      totalPages: 2,
      page: 1,
    };
    (useSuspenseFollowers as jest.Mock).mockReturnValue({
      data: mockFollowers,
      isFetching: false,
    });

    render(<ProfileFollowersTable id={mockId} />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("updates params when page changes", () => {
    const mockFollowers = {
      items: [{id: "f1", name: "Follower 1"}],
      totalPages: 2,
      page: 1,
    };
    (useSuspenseFollowers as jest.Mock).mockReturnValue({
      data: mockFollowers,
      isFetching: false,
    });

    render(<ProfileFollowersTable id={mockId} />);

    fireEvent.click(screen.getByLabelText("Go to next page"));

    expect(setParams).toHaveBeenCalledWith({...mockParams, page: 2});
  });
});
