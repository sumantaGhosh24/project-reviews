import {render, screen} from "@testing-library/react";

import Layout from "@/app/dashboard/layout";

describe("DashboardLayout", () => {
  it("renders children and parallel routes in tabs", () => {
    const mockChildren = <div data-testid="children">Children Content</div>;
    const mockProjects = <div data-testid="projects">Projects Content</div>;
    const mockComments = <div data-testid="comments">Comments Content</div>;
    const mockReviews = <div data-testid="reviews">Reviews Content</div>;

    render(
      <Layout
        projects={mockProjects}
        comments={mockComments}
        reviews={mockReviews}
      >
        {mockChildren}
      </Layout>
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();

    expect(screen.getByRole("tab", {name: /projects/i})).toBeInTheDocument();
    expect(screen.getByRole("tab", {name: /comments/i})).toBeInTheDocument();
    expect(screen.getByRole("tab", {name: /reviews/i})).toBeInTheDocument();

    expect(screen.getByTestId("projects")).toBeInTheDocument();
    expect(screen.queryByTestId("comments")).not.toBeInTheDocument();
    expect(screen.queryByTestId("reviews")).not.toBeInTheDocument();
  });
});
