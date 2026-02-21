import {render, screen, fireEvent} from "@testing-library/react";

import {useVote} from "@/features/votes/hooks/use-votes";
import {useRemoveComment} from "@/features/comments/hooks/use-comments";
import {CommentActions} from "@/features/comments/components/comment-actions";

jest.mock("@/features/votes/hooks/use-votes", () => ({
  useVote: jest.fn(),
}));
jest.mock("@/features/comments/hooks/use-comments", () => ({
  useRemoveComment: jest.fn(),
}));

describe("CommentActions", () => {
  const mockVoteMutate = jest.fn();
  const mockDeleteMutate = jest.fn();
  const props = {
    commentId: "comment-123",
    releaseId: "release-456",
    isOwner: true,
    votes: [
      {type: "UP", _count: 10},
      {type: "DOWN", _count: 2},
    ],
    myVote: null as {type: string} | null,
    onReply: jest.fn(),
    replyCount: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useVote as jest.Mock).mockReturnValue({mutate: mockVoteMutate});
    (useRemoveComment as jest.Mock).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    });
  });

  it("renders correctly with votes and reply count", () => {
    render(<CommentActions {...props} />);

    expect(screen.getByText(/Up Vote \(\+10\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Down Vote \(-2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Reply \(5\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete/i)).toBeInTheDocument();
  });

  it("calls vote mutation on up vote click", () => {
    render(<CommentActions {...props} />);

    fireEvent.click(screen.getByText(/Up Vote/i));

    expect(mockVoteMutate).toHaveBeenCalledWith({
      target: "COMMENT",
      targetId: props.commentId,
      type: "UP",
    });
  });

  it("calls vote mutation on down vote click", () => {
    render(<CommentActions {...props} />);

    fireEvent.click(screen.getByText(/Down Vote/i));

    expect(mockVoteMutate).toHaveBeenCalledWith({
      target: "COMMENT",
      targetId: props.commentId,
      type: "DOWN",
    });
  });

  it("calls onReply on reply button click", () => {
    render(<CommentActions {...props} />);

    fireEvent.click(screen.getByText(/Reply/i));

    expect(props.onReply).toHaveBeenCalled();
  });

  it("calls delete mutation on delete button click", () => {
    render(<CommentActions {...props} />);

    fireEvent.click(screen.getByText(/Delete/i));

    expect(mockDeleteMutate).toHaveBeenCalledWith({id: props.commentId});
  });

  it("does not show delete button if not owner", () => {
    render(<CommentActions {...props} isOwner={false} />);

    expect(screen.queryByText(/Delete/i)).not.toBeInTheDocument();
  });

  it("shows active variant for user's own vote", () => {
    const {rerender} = render(
      <CommentActions {...props} myVote={{type: "UP"}} />
    );

    const upVoteBtn = screen.getByRole("button", {name: /Up Vote/i});
    expect(upVoteBtn).toHaveClass("bg-success");

    rerender(<CommentActions {...props} myVote={{type: "DOWN"}} />);
    const downVoteBtn = screen.getByRole("button", {name: /Down Vote/i});
    expect(downVoteBtn).toHaveClass("bg-destructive");
  });
});
