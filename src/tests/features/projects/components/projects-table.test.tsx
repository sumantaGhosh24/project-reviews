import {useRouter} from "next/navigation";
import {render, screen, fireEvent} from "@testing-library/react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useSuspenseAllProjects} from "@/features/projects/hooks/use-projects";
import ProjectsTable from "@/features/projects/components/projects-table";

jest.mock("@/features/projects/hooks/use-projects", () => ({
  useSuspenseAllProjects: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

describe("ProjectsTable", () => {
  const mockProjects = {
    items: [
      {
        id: "1",
        title: "Test Project",
        views: 100,
        votes: [
          {type: "UP", _count: 10},
          {type: "DOWN", _count: 2},
        ],
        _count: {releases: 5},
        reviewStats: {
          _avg: {rating: 4.5},
          _count: {id: 10},
        },
        category: {name: "Category 1"},
        tags: ["tag1"],
        githubUrl: "https://github.com/test",
        websiteUrl: "https://test.com",
        status: "APPROVED",
        visibility: "PUBLIC",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
    (useSuspenseAllProjects as jest.Mock).mockReturnValue({
      data: mockProjects,
      isFetching: false,
    });
    (useGlobalParams as jest.Mock).mockReturnValue([{}, mockSetParams]);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<ProjectsTable />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders projects in table", () => {
    render(<ProjectsTable />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders empty state when no projects", () => {
    (useSuspenseAllProjects as jest.Mock).mockReturnValue({
      data: {items: [], totalPages: 0, page: 1},
      isFetching: false,
    });

    render(<ProjectsTable />);
    expect(screen.getByText("No Project Found")).toBeInTheDocument();
  });

  it("navigates to project details when View is clicked", () => {
    render(<ProjectsTable />);

    fireEvent.click(screen.getByRole("button", {name: /view/i}));

    expect(mockRouter.push).toHaveBeenCalledWith("/project/details/1");
  });

  it("updates params when page changes", () => {
    (useSuspenseAllProjects as jest.Mock).mockReturnValue({
      data: {...mockProjects, totalPages: 2},
      isFetching: false,
    });
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1}, mockSetParams]);

    render(<ProjectsTable />);

    const nextBtn = screen.getByLabelText(/go to next page/i);
    fireEvent.click(nextBtn);

    expect(mockSetParams).toHaveBeenCalledWith({page: 2});
  });
});
