import {render, screen} from "@testing-library/react";

import ProfileFollowers from "@/features/profile/components/profile-followers";

jest.mock("@/features/profile/components/profile-followers-table", () => ({
  __esModule: true,
  default: ({id}: {id: string}) => (
    <div data-testid="profile-followers-table">Followers {id}</div>
  ),
}));

describe("ProfileFollowers", () => {
  it("renders header and followers table", () => {
    render(<ProfileFollowers id="user-1" />);

    expect(screen.getByText("Followers")).toBeInTheDocument();
    expect(screen.getByText("User followers")).toBeInTheDocument();
    expect(screen.getByTestId("profile-followers-table")).toHaveTextContent(
      "user-1"
    );
  });
});

