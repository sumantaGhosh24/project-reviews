import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
} from "@/lib/auth/o-auth-providers";
import {DiscordIcon, GitHubIcon} from "@/features/auth/components/o-auth-icons";

describe("OAuth Providers", () => {
  it("should have github and discord as supported providers", () => {
    expect(SUPPORTED_OAUTH_PROVIDERS).toContain("github");
    expect(SUPPORTED_OAUTH_PROVIDERS).toContain("discord");
    expect(SUPPORTED_OAUTH_PROVIDERS.length).toBe(2);
  });

  it("should have correct details for github", () => {
    expect(SUPPORTED_OAUTH_PROVIDER_DETAILS.github.name).toBe("GitHub");
    expect(SUPPORTED_OAUTH_PROVIDER_DETAILS.github.Icon).toBe(GitHubIcon);
  });

  it("should have correct details for discord", () => {
    expect(SUPPORTED_OAUTH_PROVIDER_DETAILS.discord.name).toBe("Discord");
    expect(SUPPORTED_OAUTH_PROVIDER_DETAILS.discord.Icon).toBe(DiscordIcon);
  });
});
