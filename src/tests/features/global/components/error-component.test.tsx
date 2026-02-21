import {render, screen, fireEvent} from "@testing-library/react";
import {useRouter} from "next/navigation";

import ErrorComponent from "@/features/global/components/error-component";

const mockPush = jest.fn();

describe("ErrorComponent", () => {
  const defaultProps = {
    title: "Error Title",
    description: "Error Description",
    buttonText: "Go Back",
    redirectUrl: "/home",
  };

  it("matches snapshot", () => {
    const {asFragment} = render(<ErrorComponent {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({push: mockPush});
  });

  it("renders correctly with provided props", () => {
    render(<ErrorComponent {...defaultProps} />);

    expect(screen.getByText("Error Title")).toBeInTheDocument();
    expect(screen.getByText("Error Description")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("redirects to redirectUrl when button is clicked", () => {
    render(<ErrorComponent {...defaultProps} />);

    fireEvent.click(screen.getByText("Go Back"));

    expect(mockPush).toHaveBeenCalledWith("/home");
  });
});
