import {render, screen} from "@testing-library/react";

import ProjectCard from "@/features/projects/components/project-card";

describe("ProjectCard", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockProject: any = {
    id: "proj1",
    title: "Test Project",
    description: "This is a test project description",
    status: "PRODUCTION",
    visibility: "PUBLIC",
    githubUrl: "https://github.com/test",
    websiteUrl: "https://test.com",
    tags: ["react", "jest"],
    category: {id: "cat1", name: "Technology"},
    owner: {id: "user1", name: "John Doe", image: null},
    _count: {releases: 5},
    votes: [
      {type: "UP", _count: 10},
      {type: "DOWN", _count: 2},
    ],
    views: 100,
    reviewStats: {
      _count: {id: 10},
      _avg: {rating: 4.5},
    },
    images: [
      {id: "img1", url: "https://example.com/img1.png"},
      {id: "img2", url: "https://example.com/img2.png"},
    ],
  };

  it("renders project information correctly", () => {
    render(<ProjectCard {...mockProject} />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test project description")
    ).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders badges and tags correctly", () => {
    render(<ProjectCard {...mockProject} />);

    expect(screen.getByText("PRODUCTION")).toBeInTheDocument();
    expect(screen.getByText("PUBLIC")).toBeInTheDocument();
    expect(screen.getByText(/react/i)).toBeInTheDocument();
    expect(screen.getByText(/jest/i)).toBeInTheDocument();
  });

  it("renders stats correctly", () => {
    render(<ProjectCard {...mockProject} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(
      screen.getByText("2", {selector: "span.text-xs"})
    ).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("4.5 (10)")).toBeInTheDocument();
  });

  it("renders links correctly", () => {
    render(<ProjectCard {...mockProject} />);

    const links = screen.getAllByRole("link");
    expect(
      links.some(
        (link) => link.getAttribute("href") === "https://github.com/test"
      )
    ).toBe(true);
    expect(
      links.some((link) => link.getAttribute("href") === "https://test.com")
    ).toBe(true);
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<ProjectCard {...mockProject} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
