import {render, screen} from "@testing-library/react";

import NotFound from "@/app/not-found";

describe("NotFound Page", () => {
  it("renders 404 message and back to home link", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<NotFound />);

    expect(screen.getByText(/404 - Not Found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/The page you're looking for doesn't exist/i)
    ).toBeInTheDocument();

    const link = screen.getByRole("link", {name: /back to home/i});
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");

    consoleErrorSpy.mockRestore();
  });
});
