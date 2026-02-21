/* eslint-disable @typescript-eslint/no-explicit-any */
import {render, screen} from "@testing-library/react";

import ReleaseCard from "@/features/releases/components/release-card";

describe("ReleaseCard", () => {
  const mockRelease = {
    id: "rel1",
    title: "Test Release",
    description: "Test Description",
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
    images: [
      {url: "https://example.com/img1.png"},
      {url: "https://example.com/img2.png"},
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<ReleaseCard {...(mockRelease as any)} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders release information correctly", () => {
    render(<ReleaseCard {...(mockRelease as any)} />);
    expect(screen.getByText("Test Release")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("APPROVED")).toBeInTheDocument();
    expect(screen.getByText("PUBLIC")).toBeInTheDocument();
  });

  it("displays vote counts correctly", () => {
    render(<ReleaseCard {...(mockRelease as any)} />);
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("displays review rating and count correctly", () => {
    render(<ReleaseCard {...(mockRelease as any)} />);
    expect(screen.getByText(/4.2/)).toBeInTheDocument();
    expect(screen.getByText(/\(10\)/)).toBeInTheDocument();
  });

  it("displays view count correctly", () => {
    render(<ReleaseCard {...(mockRelease as any)} />);
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("renders correct number of images in avatar group", () => {
    const {container} = render(<ReleaseCard {...(mockRelease as any)} />);
    const avatars = container.querySelectorAll('[data-slot="avatar"]');
    expect(avatars).toHaveLength(2);
  });

  it("shows +n when there are more than 3 images", () => {
    const manyImagesRelease = {
      ...mockRelease,
      images: [{url: "1"}, {url: "2"}, {url: "3"}, {url: "4"}, {url: "5"}],
    };
    render(<ReleaseCard {...(manyImagesRelease as any)} />);
    expect(screen.getByText("+ 2")).toBeInTheDocument();
  });
});
