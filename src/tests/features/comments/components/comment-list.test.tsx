import {render, screen, fireEvent} from "@testing-library/react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useSuspenseComments} from "@/features/comments/hooks/use-comments";
import {CommentList} from "@/features/comments/components/comment-list";

jest.mock("@/features/comments/hooks/use-comments", () => ({
  useSuspenseComments: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/comments/components/comment-item", () => ({
  CommentItem: ({comment}: {comment: {id: string; body: string}}) => (
    <div data-testid={`comment-item-${comment.id}`}>{comment.body}</div>
  ),
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

describe("CommentList", () => {
  const mockReleaseId = "rel-123";
  const mockSetParams = jest.fn();
  const mockComments = {
    items: [
      {id: "1", body: "Comment 1"},
      {id: "2", body: "Comment 2"},
    ],
    totalPages: 2,
    page: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalParams as jest.Mock).mockReturnValue([{}, mockSetParams]);
    (useSuspenseComments as jest.Mock).mockReturnValue({
      data: mockComments,
      isFetching: false,
    });
  });

  it("renders correctly with comments", () => {
    render(<CommentList releaseId={mockReleaseId} />);

    expect(screen.getByTestId("comment-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("comment-item-2")).toBeInTheDocument();
    expect(screen.getByText("Comment 1")).toBeInTheDocument();
    expect(screen.getByText("Comment 2")).toBeInTheDocument();
  });

  it("calls setParams when changing page", () => {
    render(<CommentList releaseId={mockReleaseId} />);

    fireEvent.click(screen.getByText("Next Page"));

    expect(mockSetParams).toHaveBeenCalledWith({page: 2});
  });

  it("renders empty component when no comments", () => {
    (useSuspenseComments as jest.Mock).mockReturnValue({
      data: {items: [], totalPages: 0, page: 1},
      isFetching: false,
    });

    render(<CommentList releaseId={mockReleaseId} />);

    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    expect(screen.getByText("No Comment Found")).toBeInTheDocument();
  });
});
