import {useRouter} from "next/navigation";
import {render, screen, fireEvent} from "@testing-library/react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useSuspenseMyProjects} from "@/features/projects/hooks/use-projects";
import DashboardProjectsTable from "@/features/projects/components/dashboard-projects-table";

jest.mock("@/features/projects/hooks/use-projects", () => ({
  useSuspenseMyProjects: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/projects/components/delete-project", () => ({
  __esModule: true,
  default: ({id}: {id: string}) => (
    <button data-testid={`delete-project-${id}`}>Delete</button>
  ),
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

describe("DashboardProjectsTable", () => {
  const mockProjects = {
    items: [
      {
        id: "proj1",
        title: "Test Project",
        status: "PRODUCTION",
        visibility: "PUBLIC",
        githubUrl: "https://github.com/test",
        websiteUrl: "https://test.com",
        tags: ["react"],
        category: {id: "cat1", name: "Tech"},
        _count: {releases: 5},
        votes: [{type: "UP", _count: 10}],
        views: 100,
        reviewStats: {_count: {id: 10}, _avg: {rating: 4.5}},
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
    ],
    totalPages: 1,
    page: 1,
  };

  const mockRouter = {
    push: jest.fn(),
  };

  const mockSetParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseMyProjects as jest.Mock).mockReturnValue({
      data: mockProjects,
      isFetching: false,
    });
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1}, mockSetParams]);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders the table with project data", () => {
    render(<DashboardProjectsTable />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("Tech")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("4.5 (10)")).toBeInTheDocument();
  });

  it("navigates to project details when View is clicked", () => {
    render(<DashboardProjectsTable />);

    fireEvent.click(screen.getByRole("button", {name: /View/i}));
    expect(mockRouter.push).toHaveBeenCalledWith("/project/details/proj1");
  });

  it("navigates to update project when Update is clicked", () => {
    render(<DashboardProjectsTable />);

    fireEvent.click(screen.getByRole("button", {name: /Update/i}));
    expect(mockRouter.push).toHaveBeenCalledWith("/project/update/proj1");
  });

  it("renders empty state when no projects", () => {
    (useSuspenseMyProjects as jest.Mock).mockReturnValue({
      data: {items: [], totalPages: 0, page: 1},
      isFetching: false,
    });

    render(<DashboardProjectsTable />);

    expect(screen.getByText("No Project Found")).toBeInTheDocument();
  });

  it("handles pagination", () => {
    (useSuspenseMyProjects as jest.Mock).mockReturnValue({
      data: {...mockProjects, totalPages: 2},
      isFetching: false,
    });

    render(<DashboardProjectsTable />);

    fireEvent.click(screen.getByTestId("pagination"));

    expect(mockSetParams).toHaveBeenCalledWith({page: 2});
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<DashboardProjectsTable />);
    expect(asFragment()).toMatchSnapshot();
  });
});
