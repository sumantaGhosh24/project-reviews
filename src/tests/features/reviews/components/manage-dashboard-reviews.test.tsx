import {render, screen} from "@testing-library/react";
import {axe} from "jest-axe";

import ManageDashboardReviews from "@/features/reviews/components/manage-dashboard-reviews";

jest.mock("@/features/reviews/components/dashboard-reviews-table", () => ({
  __esModule: true,
  default: () => <div data-testid="reviews-table">Reviews Table</div>,
}));
jest.mock("@/features/global/components/component-wrapper", () => ({
  __esModule: true,
  default: ({
    title,
    description,
    table,
  }: {
    title: string;
    description: string;
    table: React.ReactNode;
  }) => (
    <div data-testid="wrapper">
      <h1>{title}</h1>
      <p>{description}</p>
      {table}
    </div>
  ),
}));

describe("ManageDashboardReviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<ManageDashboardReviews />);

    expect(screen.getByText("Manage My Reviews")).toBeInTheDocument();
    expect(screen.getByText("Manage my reviews.")).toBeInTheDocument();
    expect(screen.getByTestId("reviews-table")).toBeInTheDocument();
  });

  it("passes accessibility tests", async () => {
    const {container} = render(<ManageDashboardReviews />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
