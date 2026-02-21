import {render, screen} from "@testing-library/react";

import ProfileFollowings from "@/features/profile/components/profile-followings";

jest.mock("@/features/profile/components/profile-followings-table", () => ({
  __esModule: true,
  default: ({id}: {id: string}) => (
    <div data-testid="profile-followings-table">Followings {id}</div>
  ),
}));

describe("ProfileFollowings", () => {
  it("renders header and followings table", () => {
    render(<ProfileFollowings id="user-1" />);

    expect(screen.getByText("Followers")).toBeInTheDocument();
    expect(screen.getByText("User followers")).toBeInTheDocument();
    expect(screen.getByTestId("profile-followings-table")).toHaveTextContent(
      "user-1"
    );
  });
});

