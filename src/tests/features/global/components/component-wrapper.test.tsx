import {render, screen} from "@testing-library/react";

import ComponentWrapper from "@/features/global/components/component-wrapper";

describe("ComponentWrapper", () => {
  const defaultProps = {
    title: "Test Title",
    description: "Test Description",
  };

  it("matches snapshot", () => {
    const {asFragment} = render(<ComponentWrapper {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders title and description", () => {
    render(<ComponentWrapper {...defaultProps} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders optional components", () => {
    render(
      <ComponentWrapper
        {...defaultProps}
        button={<button>Test Button</button>}
        search={<div>Test Search</div>}
        filter={<div>Test Filter</div>}
        table={<div>Test Table</div>}
      />
    );
    expect(screen.getByText("Test Button")).toBeInTheDocument();
    expect(screen.getByText("Test Search")).toBeInTheDocument();
    expect(screen.getByText("Test Filter")).toBeInTheDocument();
    expect(screen.getByText("Test Table")).toBeInTheDocument();
  });
});
