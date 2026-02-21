import {render, screen, fireEvent} from "@testing-library/react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useSuspenseUserProjects} from "@/features/projects/hooks/use-projects";
import ProfileProjects from "@/features/projects/components/profile-projects";

jest.mock("@/features/projects/hooks/use-projects", () => ({
  useSuspenseUserProjects: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/projects/components/project-card", () => {
  return function MockProjectCard({title}: {title: string}) {
    return <div data-testid="project-card">{title}</div>;
  };
});
jest.mock("@/features/global/components/search-bar-component", () => {
  return function MockSearchBarComponent({placeholder}: {placeholder: string}) {
    return <input data-testid="search-bar" placeholder={placeholder} />;
  };
});
jest.mock("@/features/global/components/filter-component", () => {
  return function MockFilterComponent() {
    return <div data-testid="filter-component">Filter</div>;
  };
});
jest.mock("@/features/global/components/pagination-component", () => {
  return function MockPaginationComponent({
    onPageChange,
  }: {
    onPageChange: (page: number) => void;
  }) {
    return (
      <button data-testid="pagination" onClick={() => onPageChange(2)}>
        Next Page
      </button>
    );
  };
});
jest.mock("@/features/global/components/empty-component", () => {
  return function MockEmptyComponent({title}: {title: string}) {
    return <div data-testid="empty-component">{title}</div>;
  };
});

const mockProjects = {
  items: [
    {id: "p1", title: "Project 1"},
    {id: "p2", title: "Project 2"},
  ],
  totalPages: 2,
  page: 1,
};

describe("ProfileProjects", () => {
  const mockSetParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalParams as jest.Mock).mockReturnValue([{}, mockSetParams]);
  });

  it("renders projects correctly", () => {
    (useSuspenseUserProjects as jest.Mock).mockReturnValue({
      data: mockProjects,
      isFetching: false,
    });

    render(<ProfileProjects id="user1" />);

    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("filter-component")).toBeInTheDocument();
    expect(screen.getAllByTestId("project-card")).toHaveLength(2);
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("calls setParams when page changes", () => {
    (useSuspenseUserProjects as jest.Mock).mockReturnValue({
      data: mockProjects,
      isFetching: false,
    });

    render(<ProfileProjects id="user1" />);

    fireEvent.click(screen.getByTestId("pagination"));

    expect(mockSetParams).toHaveBeenCalledWith(
      expect.objectContaining({page: 2})
    );
  });

  it("renders empty component when no projects", () => {
    (useSuspenseUserProjects as jest.Mock).mockReturnValue({
      data: {items: [], totalPages: 0, page: 1},
      isFetching: false,
    });

    render(<ProfileProjects id="user1" />);

    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    expect(screen.getByText(/no project found/i)).toBeInTheDocument();
  });
});
