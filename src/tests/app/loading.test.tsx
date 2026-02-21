import {render, screen} from "@testing-library/react";

import Loading from "@/app/loading";

jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({className}: {className: string}) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

describe("Loading Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders skeleton components", () => {
    render(<Loading />);

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBe(8);
  });
});
