import {useTheme} from "next-themes";
import {render, screen, fireEvent} from "@testing-library/react";

import {useVote} from "@/features/votes/hooks/use-votes";
import {useHasActiveSubscription} from "@/features/subscriptions/hooks/useSubscription";
import {authClient} from "@/lib/auth/auth-client";
import {useSuspenseViewProject} from "@/features/projects/hooks/use-projects";
import ProjectDetails from "@/features/projects/components/project-details";

jest.mock("@/features/projects/hooks/use-projects", () => ({
  useSuspenseViewProject: jest.fn(),
}));
jest.mock("@/features/votes/hooks/use-votes", () => ({
  useVote: jest.fn(),
}));
jest.mock("@/features/subscriptions/hooks/useSubscription", () => ({
  useHasActiveSubscription: jest.fn(),
}));
jest.mock("@/features/releases/components/manage-release", () => ({
  __esModule: true,
  default: () => <div>Manage Releases</div>,
}));
jest.mock("@/features/projects/components/project-chat", () => ({
  __esModule: true,
  default: ({content}: {content: string}) => (
    <div data-testid="project-chat">{content}</div>
  ),
}));
jest.mock("@uiw/react-md-editor", () => ({
  __esModule: true,
  default: {
    Markdown: () => <div data-testid="markdown">Markdown</div>,
  },
  Markdown: () => <div data-testid="markdown">Markdown</div>,
}));

describe("ProjectDetails", () => {
  const mockProject = {
    id: "1",
    title: "Test Project",
    description: "Test Description",
    status: "APPROVED",
    visibility: "PUBLIC",
    category: {id: "cat1", name: "Category 1"},
    owner: {
      id: "user1",
      name: "User 1",
      email: "user1@example.com",
      image: null,
    },
    tags: ["tag1", "tag2"],
    githubUrl: "https://github.com/test",
    websiteUrl: "https://test.com",
    _count: {releases: 5},
    reviewStats: {
      _avg: {rating: 4.5},
      _count: {id: 10},
    },
    votes: [
      {type: "UP", _count: 10},
      {type: "DOWN", _count: 2},
    ],
    views: 100,
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockVote = {
    mutate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseViewProject as jest.Mock).mockReturnValue({data: mockProject});
    (useVote as jest.Mock).mockReturnValue(mockVote);
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });
    (useTheme as jest.Mock).mockReturnValue({theme: "light"});
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<ProjectDetails id="1" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders project details correctly", () => {
    render(<ProjectDetails id="1" />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("User 1")).toBeInTheDocument();
  });

  it("calls vote mutation when upvote is clicked", () => {
    render(<ProjectDetails id="1" />);
    const upvoteButton = screen.getByText(/Up Vote/i);
    fireEvent.click(upvoteButton);
    expect(mockVote.mutate).toHaveBeenCalledWith({
      target: "PROJECT",
      targetId: "1",
      type: "UP",
    });
  });

  it("calls vote mutation when downvote is clicked", () => {
    render(<ProjectDetails id="1" />);
    const downvoteButton = screen.getByText(/Down Vote/i);
    fireEvent.click(downvoteButton);
    expect(mockVote.mutate).toHaveBeenCalledWith({
      target: "PROJECT",
      targetId: "1",
      type: "DOWN",
    });
  });

  it("calls checkout when subscribe is clicked and no active subscription", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });
    render(<ProjectDetails id="1" />);
    const subscribeButton = screen.getByText("Subscribe");
    fireEvent.click(subscribeButton);
    expect(authClient.checkout).toHaveBeenCalled();
  });

  it("does not show subscribe button and renders chat when subscribed", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: true,
    });

    render(<ProjectDetails id="1" />);

    expect(screen.queryByText("Subscribe")).not.toBeInTheDocument();
    expect(screen.getByTestId("project-chat")).toBeInTheDocument();
    expect(authClient.checkout).not.toHaveBeenCalled();
  });

  it("shows owner action buttons when user is owner", () => {
    (useSuspenseViewProject as jest.Mock).mockReturnValue({
      data: {...mockProject, isOwner: true},
    });

    render(<ProjectDetails id="1" />);

    expect(screen.getByRole("link", {name: /update/i})).toHaveAttribute(
      "href",
      "/project/update/1"
    );
    expect(screen.getByRole("link", {name: /analytics/i})).toHaveAttribute(
      "href",
      "/project/details/1/analytics"
    );
  });

  it("does not show owner action buttons when user is not owner", () => {
    (useSuspenseViewProject as jest.Mock).mockReturnValue({
      data: {...mockProject, isOwner: false},
    });

    render(<ProjectDetails id="1" />);

    expect(
      screen.queryByRole("link", {name: /update/i})
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {name: /analytics/i})
    ).not.toBeInTheDocument();
  });
});
