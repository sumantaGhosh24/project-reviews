import {render, screen, fireEvent} from "@testing-library/react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useSuspensePublicProjects} from "@/features/projects/hooks/use-projects";
import HomeProjects from "@/features/projects/components/home-projects";

jest.mock("@/features/projects/hooks/use-projects", () => ({
  useSuspensePublicProjects: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/projects/components/project-card", () => ({
  __esModule: true,
  default: () => <div data-testid="project-card">Project Card</div>,
}));

describe("HomeProjects", () => {
  const mockProjects = {
    items: [
      {id: "1", title: "Project 1"},
      {id: "2", title: "Project 2"},
    ],
    totalPages: 1,
    page: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspensePublicProjects as jest.Mock).mockReturnValue({
      data: mockProjects,
      isFetching: false,
    });
    (useGlobalParams as jest.Mock).mockReturnValue([{}, jest.fn()]);
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<HomeProjects />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders a grid of projects", () => {
    render(<HomeProjects />);
    const projectCards = screen.getAllByTestId("project-card");
    expect(projectCards).toHaveLength(2);
  });

  it("renders empty state when no projects", () => {
    (useSuspensePublicProjects as jest.Mock).mockReturnValue({
      data: {items: [], totalPages: 0, page: 1},
      isFetching: false,
    });

    render(<HomeProjects />);
    expect(screen.getByText("No Project Found")).toBeInTheDocument();
  });

  it("renders pagination when there are multiple pages", () => {
    (useSuspensePublicProjects as jest.Mock).mockReturnValue({
      data: {...mockProjects, totalPages: 2},
      isFetching: false,
    });

    render(<HomeProjects />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("updates params when page changes", () => {
    const mockSetParams = jest.fn();
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1}, mockSetParams]);
    (useSuspensePublicProjects as jest.Mock).mockReturnValue({
      data: {...mockProjects, totalPages: 2, page: 1},
      isFetching: false,
    });

    render(<HomeProjects />);

    const nextBtn = screen.getByLabelText(/Go to next page/i);
    fireEvent.click(nextBtn);

    expect(mockSetParams).toHaveBeenCalledWith(
      expect.objectContaining({page: 2})
    );
  });
});
