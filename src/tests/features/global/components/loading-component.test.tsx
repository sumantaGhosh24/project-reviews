import {render, screen} from "@testing-library/react";

import LoadingComponent from "@/features/global/components/loading-component";

describe("LoadingComponent", () => {
  it("matches snapshot", () => {
    const {asFragment} = render(<LoadingComponent />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders with default text", () => {
    render(<LoadingComponent />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByText("Please wait")).toBeInTheDocument();
  });
});
