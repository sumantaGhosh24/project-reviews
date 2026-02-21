import {render, screen} from "@testing-library/react";

import ManageProjects from "@/features/projects/components/manage-projects";

jest.mock("@/features/global/components/component-wrapper", () => {
  return function MockComponentWrapper({
    title,
    description,
    search,
    filter,
    table,
  }: {
    title: string;
    description: string;
    search: React.ReactNode;
    filter: React.ReactNode;
    table: React.ReactNode;
  }) {
    return (
      <div data-testid="component-wrapper">
        <h1>{title}</h1>
        <p>{description}</p>
        <div>{search}</div>
        <div>{filter}</div>
        <div>{table}</div>
      </div>
    );
  };
});
jest.mock("@/features/global/components/search-bar-component", () => {
  return function MockSearchBarComponent({placeholder}: {placeholder: string}) {
    return <input data-testid="search-bar" placeholder={placeholder} />;
  };
});
jest.mock("@/features/global/components/filter-component", () => {
  return function MockFilterComponent() {
    return <div data-testid="filter-component">Filter</div>;
  };
});
jest.mock("@/features/projects/components/projects-table", () => {
  return function MockProjectsTable() {
    return <div data-testid="projects-table">Projects Table</div>;
  };
});

describe("ManageProjects", () => {
  it("renders correctly", () => {
    render(<ManageProjects />);

    expect(screen.getByText(/manage projects/i)).toBeInTheDocument();
    expect(screen.getByText(/admin manage all projects/i)).toBeInTheDocument();
    expect(screen.getByTestId("search-bar")).toHaveAttribute(
      "placeholder",
      "Search projects"
    );
    expect(screen.getByTestId("filter-component")).toBeInTheDocument();
    expect(screen.getByTestId("projects-table")).toBeInTheDocument();
  });
});
