import {render, screen, fireEvent} from "@testing-library/react";

import {useSuspenseRelease} from "@/features/releases/hooks/use-releases";
import {useVote} from "@/features/votes/hooks/use-votes";
import {useHasActiveSubscription} from "@/features/subscriptions/hooks/useSubscription";
import {authClient} from "@/lib/auth/auth-client";
import ReleaseDetails from "@/features/releases/components/release-details";

jest.mock("@/features/releases/hooks/use-releases", () => ({
  useSuspenseRelease: jest.fn(),
}));
jest.mock("@/features/votes/hooks/use-votes", () => ({
  useVote: jest.fn(),
}));
jest.mock("@/features/subscriptions/hooks/useSubscription", () => ({
  useHasActiveSubscription: jest.fn(),
}));
jest.mock("@/features/reviews/components/manage-reviews", () => ({
  __esModule: true,
  default: () => <div data-testid="manage-reviews">Manage Reviews</div>,
}));
jest.mock("@/features/comments/components/manage-comments", () => ({
  __esModule: true,
  default: () => <div data-testid="manage-comments">Manage Comments</div>,
}));
jest.mock("@/features/releases/components/delete-release", () => ({
  __esModule: true,
  default: () => <div data-testid="delete-release">Delete Release</div>,
}));
jest.mock("@/features/releases/components/release-chat", () => ({
  __esModule: true,
  default: () => <div data-testid="release-chat">Release Chat</div>,
}));

describe("ReleaseDetails", () => {
  const mockRelease = {
    id: "rel1",
    title: "Test Release",
    description: "Test Description",
    content: "Markdown Content",
    status: "APPROVED",
    visibility: "PUBLIC",
    projectId: "proj1",
    _count: {
      comments: 5,
      reviews: 10,
    },
    votes: [
      {type: "UP", _count: 15},
      {type: "DOWN", _count: 3},
    ],
    views: 120,
    reviewStats: {
      _count: {
        id: 10,
      },
      _avg: {
        rating: 4.2,
      },
    },
    images: [{url: "https://example.com/img1.png"}],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockVote = {
    mutate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseRelease as jest.Mock).mockReturnValue({data: mockRelease});
    (useVote as jest.Mock).mockReturnValue(mockVote);
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: true,
    });
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<ReleaseDetails id="rel1" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders release information correctly", async () => {
    render(<ReleaseDetails id="rel1" />);
    expect(screen.getByText("Test Release")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(await screen.findByText("Markdown Content")).toBeInTheDocument();
  });

  it("calls vote mutation when upvote is clicked", () => {
    render(<ReleaseDetails id="rel1" />);
    fireEvent.click(screen.getByText(/Up Vote/));
    expect(mockVote.mutate).toHaveBeenCalledWith({
      target: "RELEASE",
      targetId: "rel1",
      type: "UP",
    });
  });

  it("calls vote mutation when downvote is clicked", () => {
    render(<ReleaseDetails id="rel1" />);
    fireEvent.click(screen.getByText(/Down Vote/));
    expect(mockVote.mutate).toHaveBeenCalledWith({
      target: "RELEASE",
      targetId: "rel1",
      type: "DOWN",
    });
  });

  it("calls checkout when subscribe is clicked and no active subscription", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    render(<ReleaseDetails id="rel1" />);
    fireEvent.click(screen.getByText(/Subscribe/));
    expect(authClient.checkout).toHaveBeenCalled();
  });

  it("shows chat and not subscribe button when user has active subscription", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: true,
    });

    render(<ReleaseDetails id="rel1" />);

    expect(screen.getByTestId("release-chat")).toBeInTheDocument();
    expect(screen.queryByText(/Subscribe/)).not.toBeInTheDocument();
    expect(authClient.checkout).not.toHaveBeenCalled();
  });

  it("switches tabs correctly", async () => {
    render(<ReleaseDetails id="rel1" />);

    expect(screen.getByTestId("manage-comments")).toBeInTheDocument();
    expect(screen.queryByTestId("manage-reviews")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", {name: /reviews/i}));
    expect(await screen.findByTestId("manage-reviews")).toBeInTheDocument();
    expect(screen.queryByTestId("manage-comments")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", {name: /comments/i}));
    expect(await screen.findByTestId("manage-comments")).toBeInTheDocument();
  });
});
