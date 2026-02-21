import {render, screen} from "@testing-library/react";

import {ThemeProvider} from "@/components/theme-provider";

describe("ThemeProvider", () => {
  it("renders children within NextThemesProvider", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div data-testid="child">Hello</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId("next-themes-provider")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Hello");
  });
});
