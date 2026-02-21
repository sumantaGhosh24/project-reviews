import {render} from "@testing-library/react";

import {DiscordIcon, GitHubIcon} from "@/features/auth/components/o-auth-icons";

describe("OAuthIcons", () => {
  it("renders DiscordIcon correctly", () => {
    const {container} = render(<DiscordIcon data-testid="discord-icon" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("size-4");
  });

  it("renders GitHubIcon correctly", () => {
    const {container} = render(<GitHubIcon data-testid="github-icon" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("size-4");
  });
});
