import {render, screen, fireEvent} from "@testing-library/react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useSuspenseMyComments} from "@/features/comments/hooks/use-comments";
import DashboardCommentsTable from "@/features/comments/components/dashboard-comments-table";

jest.mock("@/features/comments/hooks/use-comments", () => ({
  useSuspenseMyComments: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/global/components/pagination-component", () => {
  return function MockPaginationComponent({
    onPageChange,
  }: {
    onPageChange: (page: number) => void;
  }) {
    return <button onClick={() => onPageChange(2)}>Next Page</button>;
  };
});
jest.mock("@/features/global/components/empty-component", () => {
  return function MockEmptyComponent({title}: {title: string}) {
    return <div data-testid="empty-component">{title}</div>;
  };
});

describe("DashboardCommentsTable", () => {
  const mockSetParams = jest.fn();
  const mockComments = {
    items: [
      {
        id: "1",
        body: "Test comment 1",
        author: {id: "user-1", name: "User 1"},
        release: {id: "rel-1", project: {id: "proj-1"}},
        votes: [
          {type: "UP", _count: 5},
          {type: "DOWN", _count: 1},
        ],
        parentId: null,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: "2",
        body: "Test comment 2 which is quite long and should be truncated for the table view",
        author: {id: "user-2", name: "User 2"},
        release: {id: "rel-2", project: {id: "proj-2"}},
        votes: [],
        parentId: "1",
        replies: [{id: "3"}],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    ],
    totalPages: 2,
    page: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalParams as jest.Mock).mockReturnValue([{}, mockSetParams]);
    (useSuspenseMyComments as jest.Mock).mockReturnValue({
      data: mockComments,
      isFetching: false,
    });
  });

  it("renders correctly with data", () => {
    render(<DashboardCommentsTable />);

    expect(screen.getByText("Test comment 1")).toBeInTheDocument();
    expect(
      screen.getByText(/Test comment 2 which is quite long and should b/i)
    ).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    const row1 = rows[1];

    expect(row1).toHaveTextContent("5");
    expect(row1).toHaveTextContent("1");

    expect(screen.getByText("No Parent")).toBeInTheDocument();

    const row2 = rows[2];
    expect(row2).toHaveTextContent("1");
  });

  it("calls setParams when changing page", () => {
    render(<DashboardCommentsTable />);

    fireEvent.click(screen.getByText("Next Page"));

    expect(mockSetParams).toHaveBeenCalledWith({page: 2});
  });

  it("renders empty component when no comments", () => {
    (useSuspenseMyComments as jest.Mock).mockReturnValue({
      data: {items: [], totalPages: 0, page: 1},
      isFetching: false,
    });

    render(<DashboardCommentsTable />);

    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    expect(screen.getByText("No Comment Found")).toBeInTheDocument();
  });
});
