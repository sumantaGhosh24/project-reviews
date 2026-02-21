import {render, screen, fireEvent} from "@testing-library/react";

import {useSuspenseReleases} from "@/features/releases/hooks/use-releases";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import ReleasesTable from "@/features/releases/components/releases-table";

jest.mock("@/features/releases/hooks/use-releases", () => ({
  useSuspenseReleases: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/global/components/pagination-component", () => ({
  __esModule: true,
  default: ({
    onPageChange,
    disabled,
  }: {
    onPageChange: (page: number) => void;
    disabled: boolean;
  }) => (
    <button
      data-testid="pagination"
      onClick={() => onPageChange(2)}
      disabled={disabled}
    >
      Next Page
    </button>
  ),
}));

describe("ReleasesTable", () => {
  const mockReleases = {
    items: [
      {
        id: "rel1",
        title: "Release 1",
        description: "Desc 1",
        status: "APPROVED",
        visibility: "PUBLIC",
        projectId: "proj1",
        _count: {comments: 1, reviews: 1},
        votes: [],
        views: 10,
        reviewStats: {_count: {id: 1}, _avg: {rating: 5}},
        images: [],
      },
    ],
    totalPages: 1,
    page: 1,
  };

  const mockSetParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseReleases as jest.Mock).mockReturnValue({
      data: mockReleases,
      isFetching: false,
    });
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1}, mockSetParams]);
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<ReleasesTable projectId="proj1" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders releases", () => {
    render(<ReleasesTable projectId="proj1" />);
    expect(screen.getByText("Release 1")).toBeInTheDocument();
  });

  it("renders empty state when no releases", () => {
    (useSuspenseReleases as jest.Mock).mockReturnValue({
      data: {items: [], totalPages: 0, page: 1},
      isFetching: false,
    });

    render(<ReleasesTable projectId="proj1" />);
    expect(screen.getByText("No Release Found")).toBeInTheDocument();
  });

  it("renders pagination when there are multiple pages", () => {
    (useSuspenseReleases as jest.Mock).mockReturnValue({
      data: {...mockReleases, totalPages: 2},
      isFetching: false,
    });

    render(<ReleasesTable projectId="proj1" />);
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("handles pagination", () => {
    (useSuspenseReleases as jest.Mock).mockReturnValue({
      data: {...mockReleases, totalPages: 2},
      isFetching: false,
    });

    render(<ReleasesTable projectId="proj1" />);

    fireEvent.click(screen.getByTestId("pagination"));

    expect(mockSetParams).toHaveBeenCalledWith({page: 2});
  });
});
