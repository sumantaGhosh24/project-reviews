import {render, screen} from "@testing-library/react";

import ManageReleases from "@/features/releases/components/manage-release";

jest.mock("@/features/releases/components/releases-table", () => ({
  __esModule: true,
  default: ({projectId}: {projectId: string}) => (
    <div data-testid="releases-table">Releases Table {projectId}</div>
  ),
}));
jest.mock("@/features/global/components/search-bar-component", () => ({
  __esModule: true,
  default: ({placeholder}: {placeholder: string}) => (
    <div data-testid="search-bar">{placeholder}</div>
  ),
}));

describe("ManageReleases", () => {
  const defaultProps = {
    isOwner: false,
    projectId: "proj1",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<ManageReleases {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correct title and components", () => {
    render(<ManageReleases {...defaultProps} />);
    expect(screen.getByText("All Releases")).toBeInTheDocument();
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("releases-table")).toBeInTheDocument();
  });

  it("renders Create Release button only when isOwner is true", () => {
    const {rerender} = render(<ManageReleases {...defaultProps} />);
    expect(screen.queryByText("Create Release")).not.toBeInTheDocument();

    rerender(<ManageReleases {...defaultProps} isOwner={true} />);
    expect(screen.getByText("Create Release")).toBeInTheDocument();
  });
});
