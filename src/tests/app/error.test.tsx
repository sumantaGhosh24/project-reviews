import * as Sentry from "@sentry/nextjs";
import {render, screen, fireEvent} from "@testing-library/react";

import ErrorComponent from "@/app/error";

describe("Error Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockError = new Error("Test Error");
  const mockReset = jest.fn();

  it("renders error message and calls Sentry", () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    expect(screen.getByText(/Error | Test Error/i)).toBeInTheDocument();
    expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
  });

  it("calls reset when Try Again button is clicked", () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    const button = screen.getByRole("button", {name: /try again/i});
    fireEvent.click(button);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
