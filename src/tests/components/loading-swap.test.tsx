import {render, screen} from "@testing-library/react";

import {LoadingSwap} from "@/components/loading-swap";

describe("LoadingSwap", () => {
  it("matches snapshot", () => {
    const {asFragment} = render(
      <LoadingSwap isLoading={false}>
        <div>Content</div>
      </LoadingSwap>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders children and hides spinner when isLoading is false", () => {
    render(
      <LoadingSwap isLoading={false}>
        <span>Content</span>
      </LoadingSwap>
    );

    const content = screen.getByText("Content");
    const spinner = screen.getByTestId("spinner");

    expect(content).toBeVisible();
    expect(spinner.parentElement).toHaveClass("invisible");
  });

  it("hides children and shows spinner when isLoading is true", () => {
    render(
      <LoadingSwap isLoading={true}>
        <span>Content</span>
      </LoadingSwap>
    );

    const content = screen.getByText("Content");
    const spinner = screen.getByTestId("spinner");

    expect(content.parentElement).toHaveClass("invisible");
    expect(spinner.parentElement).toHaveClass("visible");
  });

  it("applies custom className", () => {
    const {container} = render(
      <LoadingSwap isLoading={false} className="custom-class">
        <span>Content</span>
      </LoadingSwap>
    );

    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});
