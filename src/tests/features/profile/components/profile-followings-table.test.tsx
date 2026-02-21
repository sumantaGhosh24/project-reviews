import {render, screen, fireEvent} from "@testing-library/react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useSuspenseFollowings} from "@/features/profile/hooks/use-profile";
import ProfileFollowingsTable from "@/features/profile/components/profile-followings-table";

jest.mock("@/features/profile/hooks/use-profile", () => ({
  useSuspenseFollowings: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/profile/components/user-card", () => {
  return function MockUserCard({user}: {user: {name: string}}) {
    return <div data-testid="user-card">{user.name}</div>;
  };
});

describe("ProfileFollowingsTable", () => {
  const mockId = "user-123";
  const mockParams = {page: 1};
  const setParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalParams as jest.Mock).mockReturnValue([mockParams, setParams]);
  });

  it("renders followings correctly", () => {
    const mockFollowings = {
      items: [
        {id: "f1", name: "Following 1"},
        {id: "f2", name: "Following 2"},
      ],
      totalPages: 1,
      page: 1,
    };
    (useSuspenseFollowings as jest.Mock).mockReturnValue({
      data: mockFollowings,
      isFetching: false,
    });

    render(<ProfileFollowingsTable id={mockId} />);

    expect(screen.getAllByTestId("user-card")).toHaveLength(2);
    expect(screen.getByText("Following 1")).toBeInTheDocument();
    expect(screen.getByText("Following 2")).toBeInTheDocument();
  });

  it("renders empty component when no followings", () => {
    const mockFollowings = {
      items: [],
      totalPages: 0,
      page: 1,
    };
    (useSuspenseFollowings as jest.Mock).mockReturnValue({
      data: mockFollowings,
      isFetching: false,
    });

    render(<ProfileFollowingsTable id={mockId} />);

    expect(screen.getByText(/no followings found/i)).toBeInTheDocument();
  });

  it("renders pagination when multiple pages exist", () => {
    const mockFollowings = {
      items: [{id: "f1", name: "Following 1"}],
      totalPages: 2,
      page: 1,
    };
    (useSuspenseFollowings as jest.Mock).mockReturnValue({
      data: mockFollowings,
      isFetching: false,
    });

    render(<ProfileFollowingsTable id={mockId} />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("updates params when page changes", () => {
    const mockFollowings = {
      items: [{id: "f1", name: "Following 1"}],
      totalPages: 2,
      page: 1,
    };
    (useSuspenseFollowings as jest.Mock).mockReturnValue({
      data: mockFollowings,
      isFetching: false,
    });

    render(<ProfileFollowingsTable id={mockId} />);

    fireEvent.click(screen.getByLabelText("Go to next page"));

    expect(setParams).toHaveBeenCalledWith({...mockParams, page: 2});
  });
});
