import {render, screen} from "@testing-library/react";

import {requireUnauth} from "@/features/auth/helpers/auth-utils";
import LandingPage, {metadata} from "@/app/page";

jest.mock("@/features/auth/helpers/auth-utils");

describe("LandingPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Home");
  });

  it("calls requireUnauth and renders landing content", async () => {
    (requireUnauth as jest.Mock).mockResolvedValue(undefined);

    const result = await LandingPage();
    render(result);

    expect(requireUnauth).toHaveBeenCalled();
    expect(
      screen.getByText(/Build better projects through/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/honest feedback\./i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {name: /Submit Your Idea/i})
    ).toHaveAttribute("href", "/login");
    expect(
      screen.getByRole("link", {name: /Browse Projects/i})
    ).toHaveAttribute("href", "/login");
  });
});
