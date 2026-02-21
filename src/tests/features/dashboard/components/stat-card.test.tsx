import {ActivityIcon} from "lucide-react";
import {render, screen} from "@testing-library/react";

import StatCard from "@/features/dashboard/components/stat-card";

describe("StatCard", () => {
  it("renders correctly", () => {
    render(
      <StatCard title="Total Users" value={1200} icon={<ActivityIcon />} />
    );

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("1200")).toBeInTheDocument();
    expect(screen.getByTestId("icon-ActivityIcon")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const {asFragment} = render(
      <StatCard title="Test Title" value="Test Value" icon={<ActivityIcon />} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
