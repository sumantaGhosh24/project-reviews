import {render, screen} from "@testing-library/react";

import Layout from "@/app/profile/[id]/details/layout";

describe("Profile Details Layout", () => {
  it("renders children and parallel routes in tabs", () => {
    const mockChildren = <div data-testid="children">Children Content</div>;
    const mockFollowers = <div data-testid="followers">Followers Content</div>;
    const mockFollowings = <div data-testid="following">Following Content</div>;
    const mockProjects = <div data-testid="projects">Projects Content</div>;

    render(
      <Layout
        followers={mockFollowers}
        followings={mockFollowings}
        projects={mockProjects}
      >
        {mockChildren}
      </Layout>
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();

    expect(screen.getByRole("tab", {name: /followers/i})).toBeInTheDocument();
    expect(screen.getByRole("tab", {name: /following/i})).toBeInTheDocument();
    expect(screen.getByRole("tab", {name: /projects/i})).toBeInTheDocument();

    expect(screen.getByTestId("projects")).toBeInTheDocument();
    expect(screen.queryByTestId("followers")).not.toBeInTheDocument();
    expect(screen.queryByTestId("following")).not.toBeInTheDocument();
  });
});
