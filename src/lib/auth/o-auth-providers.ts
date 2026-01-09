import {ComponentProps, ElementType} from "react";

import {DiscordIcon, GitHubIcon} from "@/features/auth/components/o-auth-icons";

export const SUPPORTED_OAUTH_PROVIDERS = ["github", "discord"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  {name: string; Icon: ElementType<ComponentProps<"svg">>}
> = {
  discord: {name: "Discord", Icon: DiscordIcon},
  github: {name: "GitHub", Icon: GitHubIcon},
};
