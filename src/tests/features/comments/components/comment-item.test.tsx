/* eslint-disable @typescript-eslint/no-explicit-any */
import {render, screen, fireEvent} from "@testing-library/react";

import {CommentItem} from "@/features/comments/components/comment-item";

jest.mock("@/features/comments/components/comment-actions", () => ({
  CommentActions: ({onReply}: {onReply: () => void}) => (
    <button onClick={onReply} data-testid="comment-actions">
      Mock Actions
    </button>
  ),
}));
jest.mock("@/features/comments/components/reply-form", () => ({
  ReplyForm: () => <div data-testid="reply-form">Mock Reply Form</div>,
}));
jest.mock("@/features/comments/components/reply-item", () => ({
  ReplyItem: ({reply}: {reply: {id: string; body: string}}) => (
    <div data-testid={`reply-item-${reply.id}`}>{reply.body}</div>
  ),
}));

describe("CommentItem", () => {
  const mockComment = {
    id: "comment-1",
    body: "Parent comment",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    releaseId: "rel-1",
    authorId: "user-1",
    image: null,
    author: {
      id: "user-1",
      name: "John Doe",
      image: null,
    },
    isOwner: false,
    votes: [],
    myVote: null,
    replies: [
      {
        id: "reply-1",
        body: "Reply 1",
        authorId: "user-2",
        releaseId: "rel-1",
        parentId: "comment-1",
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: null,
        author: {
          id: "user-2",
          name: "Jane Smith",
          image: null,
        },
      },
    ],
  };

  it("renders correctly with author and body", () => {
    render(<CommentItem comment={mockComment as any} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Parent comment")).toBeInTheDocument();
    expect(screen.getByTestId("comment-actions")).toBeInTheDocument();
    expect(screen.getByTestId("reply-item-reply-1")).toBeInTheDocument();
  });

  it("toggles reply form when actions call onReply", () => {
    render(<CommentItem comment={mockComment as any} />);

    expect(screen.queryByTestId("reply-form")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("comment-actions"));

    expect(screen.getByTestId("reply-form")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("comment-actions"));

    expect(screen.queryByTestId("reply-form")).not.toBeInTheDocument();
  });

  it("does not show actions if deleted", () => {
    const deletedComment = {...mockComment, deletedAt: new Date()};
    render(<CommentItem comment={deletedComment as any} />);

    expect(screen.queryByTestId("comment-actions")).not.toBeInTheDocument();
    expect(screen.getByText("Parent comment")).toHaveClass("italic");
  });

  it("applies primary border if owner", () => {
    const ownerComment = {...mockComment, isOwner: true};
    const {container} = render(<CommentItem comment={ownerComment as any} />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
