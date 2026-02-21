import {render, screen} from "@testing-library/react";

import ManageComments from "@/features/comments/components/manage-comments";

jest.mock("@/features/comments/components/comment-list", () => ({
  CommentList: ({releaseId}: {releaseId: string}) => (
    <div data-testid="comment-list" data-release-id={releaseId}>
      Mock Comment List
    </div>
  ),
}));
jest.mock("@/features/comments/components/create-comment-form", () => ({
  CreateCommentForm: ({releaseId}: {releaseId: string}) => (
    <div data-testid="create-comment-form" data-release-id={releaseId}>
      Mock Create Comment Form
    </div>
  ),
}));

describe("ManageComments", () => {
  const mockReleaseId = "release-123";

  it("renders correctly with title, comment list and create form", () => {
    render(<ManageComments releaseId={mockReleaseId} />);

    expect(screen.getByText("All Comments")).toBeInTheDocument();

    const commentList = screen.getByTestId("comment-list");
    expect(commentList).toBeInTheDocument();
    expect(commentList).toHaveAttribute("data-release-id", mockReleaseId);

    const createForm = screen.getByTestId("create-comment-form");
    expect(createForm).toBeInTheDocument();
    expect(createForm).toHaveAttribute("data-release-id", mockReleaseId);
  });
});
