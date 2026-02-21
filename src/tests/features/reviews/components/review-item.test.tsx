import {render, screen} from "@testing-library/react";
import {axe, toHaveNoViolations} from "jest-axe";

import {ReviewItem} from "@/features/reviews/components/review-item";

expect.extend(toHaveNoViolations);

jest.mock("@/features/reviews/components/review-actions", () => ({
  ReviewActions: () => <div data-testid="review-actions" />,
}));

describe("ReviewItem", () => {
  const mockReview = {
    id: "rev-1",
    rating: 4,
    feedback: "This is a great release!",
    createdAt: new Date().toISOString(),
    releaseId: "rel-1",
    authorId: "user-1",
    author: {
      id: "user-1",
      name: "Test User",
      image: "https://example.com/image.png",
    },
    isOwner: false,
    votes: [],
    myVote: null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  it("renders review content correctly and handles missing author image", () => {
    const reviewWithNoImage = {
      ...mockReview,
      author: {...mockReview.author, image: null},
    };
    render(<ReviewItem review={reviewWithNoImage} />);

    expect(screen.getByText("This is a great release!")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();

    const img = screen.queryByRole("img");
    if (img) {
      expect(img).toHaveAttribute("src", "https://placehold.co/600x400.png");
    }
    expect(screen.getByTestId("review-actions")).toBeInTheDocument();
  });

  it("renders the correct number of stars", () => {
    const {container, rerender} = render(<ReviewItem review={mockReview} />);

    let filledStars = container.querySelectorAll(
      "[data-testid='icon-StarIcon'].text-orange-500"
    );
    let emptyStars = container.querySelectorAll(
      "[data-testid='icon-StarIcon'].text-muted-foreground"
    );

    expect(filledStars.length).toBe(4);
    expect(emptyStars.length).toBe(1);

    rerender(<ReviewItem review={{...mockReview, rating: 2}} />);
    filledStars = container.querySelectorAll(
      "[data-testid='icon-StarIcon'].text-orange-500"
    );
    emptyStars = container.querySelectorAll(
      "[data-testid='icon-StarIcon'].text-muted-foreground"
    );
    expect(filledStars.length).toBe(2);
    expect(emptyStars.length).toBe(3);
  });

  it("highlights owner reviews", () => {
    const {container: ownerContainer} = render(
      <ReviewItem review={{...mockReview, isOwner: true}} />
    );
    expect(ownerContainer.firstChild).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const {container} = render(<ReviewItem review={mockReview} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
