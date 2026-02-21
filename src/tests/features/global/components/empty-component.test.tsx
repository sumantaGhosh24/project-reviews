import {useRouter} from "next/navigation";
import {render, screen, fireEvent} from "@testing-library/react";

import EmptyComponent from "@/features/global/components/empty-component";

describe("EmptyComponent", () => {
  const mockPush = jest.fn();
  const props = {
    title: "No Data",
    description: "Please try again later.",
    buttonText: "Go Back",
    redirectUrl: "/home",
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it("renders correctly with provided props", () => {
    render(<EmptyComponent {...props} />);

    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {name: props.buttonText})
    ).toBeInTheDocument();
  });

  it("navigates to redirectUrl when button is clicked", () => {
    render(<EmptyComponent {...props} />);

    const button = screen.getByRole("button", {name: props.buttonText});
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith(props.redirectUrl);
  });
});
