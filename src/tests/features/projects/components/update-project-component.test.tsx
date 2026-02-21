import {render, screen} from "@testing-library/react";

import {useSuspenseProject} from "@/features/projects/hooks/use-projects";
import UpdateProjectComponent from "@/features/projects/components/update-project-component";

jest.mock("@/features/projects/hooks/use-projects", () => ({
  useSuspenseProject: jest.fn(),
}));
jest.mock("@/features/projects/components/update-project-form", () => {
  return function MockUpdateProjectForm() {
    return <div data-testid="update-project-form">Update Project Form</div>;
  };
});
jest.mock("@/features/projects/components/add-project-image", () => {
  return function MockAddProjectImage() {
    return <div data-testid="add-project-image">Add Project Image</div>;
  };
});
jest.mock("@/features/projects/components/remove-project-image", () => {
  return function MockRemoveProjectImage() {
    return <div data-testid="remove-project-image">Remove Project Image</div>;
  };
});

const mockProject = {
  id: "project1",
  images: [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe("UpdateProjectComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseProject as jest.Mock).mockReturnValue({
      data: mockProject,
    });
  });

  it("renders correctly and shows the default tab", () => {
    render(<UpdateProjectComponent id="project1" />);

    expect(
      screen.getByRole("tab", {name: /update project/i})
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", {name: /add project image/i})
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", {name: /remove project image/i})
    ).toBeInTheDocument();

    expect(screen.getByTestId("update-project-form")).toBeInTheDocument();
    expect(screen.queryByTestId("add-project-image")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("remove-project-image")
    ).not.toBeInTheDocument();
  });
});
