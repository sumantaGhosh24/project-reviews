import {render, screen, fireEvent} from "@testing-library/react";
import {axe, toHaveNoViolations} from "jest-axe";

import {useVote} from "@/features/votes/hooks/use-votes";
import {useRemoveReview} from "@/features/reviews/hooks/use-reviews";
import {ReviewActions} from "@/features/reviews/components/review-actions";

expect.extend(toHaveNoViolations);

jest.mock("@/features/votes/hooks/use-votes");
jest.mock("@/features/reviews/hooks/use-reviews");

describe("ReviewActions", () => {
  const mockReviewId = "rev-1";
  const mockReleaseId = "rel-1";
  const mockVotes = [
    {type: "UP", _count: 5},
    {type: "DOWN", _count: 2},
  ];

  const mockMutateVote = jest.fn();
  const mockMutateDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useVote as jest.Mock).mockReturnValue({
      mutate: mockMutateVote,
    });
    (useRemoveReview as jest.Mock).mockReturnValue({
      mutate: mockMutateDelete,
      isPending: false,
    });
  });

  const defaultProps = {
    reviewId: mockReviewId,
    releaseId: mockReleaseId,
    isOwner: false,
    votes: mockVotes,
    myVote: null,
  };

  it("renders votes correctly", () => {
    render(<ReviewActions {...defaultProps} />);

    expect(screen.getByText(/Up Vote \(\+5\)/)).toBeInTheDocument();
    expect(screen.getByText(/Down Vote \(-2\)/)).toBeInTheDocument();
  });

  it("handles upvote click", () => {
    render(<ReviewActions {...defaultProps} />);

    fireEvent.click(screen.getByText(/Up Vote/));

    expect(mockMutateVote).toHaveBeenCalledWith({
      target: "REVIEW",
      targetId: mockReviewId,
      type: "UP",
    });
  });

  it("handles downvote click", () => {
    render(<ReviewActions {...defaultProps} />);

    fireEvent.click(screen.getByText(/Down Vote/));

    expect(mockMutateVote).toHaveBeenCalledWith({
      target: "REVIEW",
      targetId: mockReviewId,
      type: "DOWN",
    });
  });

  it("shows active state for user vote", () => {
    const {rerender} = render(
      <ReviewActions {...defaultProps} myVote={{type: "UP"}} />
    );
    expect(screen.getByText(/Up Vote/).closest("button")).toHaveClass(
      "bg-success"
    );

    rerender(<ReviewActions {...defaultProps} myVote={{type: "DOWN"}} />);
    expect(screen.getByText(/Down Vote/).closest("button")).toHaveClass(
      "bg-destructive"
    );
  });

  it("renders delete button only for owner", () => {
    const {rerender} = render(
      <ReviewActions {...defaultProps} isOwner={false} />
    );
    expect(screen.queryByText(/Delete/)).not.toBeInTheDocument();

    rerender(<ReviewActions {...defaultProps} isOwner={true} />);
    expect(screen.getByText(/Delete/)).toBeInTheDocument();
  });

  it("handles delete click", () => {
    render(<ReviewActions {...defaultProps} isOwner={true} />);

    fireEvent.click(screen.getByText(/Delete/));

    expect(mockMutateDelete).toHaveBeenCalledWith({id: mockReviewId});
  });

  it("disables delete button when pending", () => {
    (useRemoveReview as jest.Mock).mockReturnValue({
      mutate: mockMutateDelete,
      isPending: true,
    });

    render(<ReviewActions {...defaultProps} isOwner={true} />);

    expect(screen.getByRole("button", {name: /Delete/i})).toBeDisabled();
  });

  it("handles missing vote counts", () => {
    render(<ReviewActions {...defaultProps} votes={[]} />);
    expect(screen.getByText(/Up Vote \(\+0\)/)).toBeInTheDocument();
    expect(screen.getByText(/Down Vote \(-0\)/)).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const {container} = render(
      <ReviewActions {...defaultProps} isOwner={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
