import {render, screen} from "@testing-library/react";

import RootLayout, {metadata} from "@/app/layout";

jest.mock("next/font/google", () => ({
  Geist: () => ({variable: "geist-sans"}),
  Geist_Mono: () => ({variable: "geist-mono"}),
}));
jest.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({children}: {children: React.ReactNode}) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));
jest.mock("@/components/header", () => ({
  __esModule: true,
  default: () => <header data-testid="header" />,
}));
jest.mock("@/features/auth/components/impersonation-indicator", () => ({
  ImpersonationIndicator: () => <div data-testid="impersonation-indicator" />,
}));
jest.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

describe("RootLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has the correct metadata", () => {
    expect(metadata.title).toEqual({
      template: "%s | Project Reviews",
      default: "Project Reviews",
    });
    expect(metadata.description).toBe("Project reviews ai sass");
  });

  it("renders children and essential components", () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Hello World</div>
      </RootLayout>
    );

    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("trpc-provider")).toBeInTheDocument();
    expect(screen.getByTestId("nuqs-adapter")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("impersonation-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
