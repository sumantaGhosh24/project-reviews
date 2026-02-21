import {render, screen} from "@testing-library/react";

import {useSuspenseRelease} from "@/features/releases/hooks/use-releases";
import UpdateReleaseComponent from "@/features/releases/components/update-release-component";

jest.mock("@/features/releases/hooks/use-releases", () => ({
  useSuspenseRelease: jest.fn(),
}));
jest.mock("@/features/releases/components/update-release-form", () => {
  return function MockUpdateReleaseForm() {
    return <div data-testid="update-release-form">Update Release Form</div>;
  };
});
jest.mock("@/features/releases/components/add-release-image", () => {
  return function MockAddReleaseImage() {
    return <div data-testid="add-release-image">Add Release Image</div>;
  };
});
jest.mock("@/features/releases/components/remove-release-image", () => {
  return function MockRemoveReleaseImage() {
    return <div data-testid="remove-release-image">Remove Release Image</div>;
  };
});

const mockRelease = {
  id: "release1",
  images: [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe("UpdateReleaseComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseRelease as jest.Mock).mockReturnValue({
      data: mockRelease,
    });
  });

  it("renders correctly and shows the default tab", () => {
    render(<UpdateReleaseComponent id="project1" releaseId="release1" />);

    expect(
      screen.getByRole("tab", {name: /update release/i})
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", {name: /add release image/i})
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", {name: /remove release image/i})
    ).toBeInTheDocument();

    expect(screen.getByTestId("update-release-form")).toBeInTheDocument();
    expect(screen.queryByTestId("add-release-image")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("remove-release-image")
    ).not.toBeInTheDocument();
  });

  it("renders back button", () => {
    render(<UpdateReleaseComponent id="project1" releaseId="release1" />);
    const backButton = screen.getByRole("link", {name: /back to release/i});
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute(
      "href",
      "/project/details/project1/release/release1"
    );
  });
});
