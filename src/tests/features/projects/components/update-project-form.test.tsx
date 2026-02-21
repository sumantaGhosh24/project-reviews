import {useTheme} from "next-themes";
import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useSuspenseAllCategories} from "@/features/categories/hooks/use-categories";
import {useUpdateProject} from "@/features/projects/hooks/use-projects";
import UpdateProjectForm from "@/features/projects/components/update-project-form";

jest.mock("@/features/projects/hooks/use-projects", () => ({
  useUpdateProject: jest.fn(),
}));
jest.mock("@/features/categories/hooks/use-categories", () => ({
  useSuspenseAllCategories: jest.fn(),
}));
jest.mock("next/dynamic", () => () => {
  const MDEditor = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (text: string) => void;
  }) => (
    <textarea
      data-testid="md-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
  return MDEditor;
});
jest.mock("@/components/tags-input", () => ({
  TagsInput: ({
    value,
    onChange,
  }: {
    value: string[];
    onChange: (text: string[]) => void;
  }) => (
    <div data-testid="tags-input">
      {value.map((tag: string) => (
        <span key={tag}>{tag}</span>
      ))}
      <button onClick={() => onChange([...value, "new-tag"])}>Add Tag</button>
    </div>
  ),
}));

describe("UpdateProjectForm", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockProject: any = {
    id: "proj1",
    title: "old title",
    description: "old description",
    categoryId: "cat1",
    githubUrl: "https://github.com/old",
    websiteUrl: "https://old.com",
    status: "DRAFT",
    visibility: "PRIVATE",
    content: "old content",
    tags: ["old-tag"],
  };

  const mockCategories = [
    {id: "cat1", name: "Category 1"},
    {id: "cat2", name: "Category 2"},
  ];

  const mockUpdateProject = {
    mutate: jest.fn(),
    isPending: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuspenseAllCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
    });
    (useUpdateProject as jest.Mock).mockReturnValue(mockUpdateProject);
    (useTheme as jest.Mock).mockReturnValue({theme: "light"});

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({markdown: "generated content"}),
      })
    ) as jest.Mock;
  });

  it("renders with initial project data", () => {
    render(<UpdateProjectForm project={mockProject} />);

    expect(screen.getByDisplayValue("old title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("old description")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("https://github.com/old")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://old.com")).toBeInTheDocument();
    expect(screen.getByTestId("md-editor")).toHaveValue("old content");
  });

  it("submits the form with updated data", async () => {
    render(<UpdateProjectForm project={mockProject} />);

    fireEvent.change(screen.getByLabelText(/Project Title/i), {
      target: {value: "new title"},
    });
    fireEvent.change(screen.getByLabelText(/Project Description/i), {
      target: {value: "new description"},
    });

    fireEvent.click(screen.getByRole("button", {name: /Update Project/i}));

    await waitFor(() => {
      expect(mockUpdateProject.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "new title",
          description: "new description",
          content: "old content",
        })
      );
    });
  });

  it("generates content using AI", async () => {
    render(<UpdateProjectForm project={mockProject} />);

    fireEvent.click(
      screen.getByRole("button", {name: /Update Content Using AI/i})
    );

    expect(screen.getByText("Generating...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("md-editor")).toHaveValue("generated content");
    });
  });

  it("shows error when AI content generation fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<UpdateProjectForm project={mockProject} />);

    fireEvent.click(
      screen.getByRole("button", {name: /Update Content Using AI/i})
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("API Error");
    });
  });

  it("shows error if content is empty on submit", async () => {
    const projectWithoutContent = {...mockProject, content: undefined};
    render(<UpdateProjectForm project={projectWithoutContent} />);

    const editor = screen.getByTestId("md-editor");
    fireEvent.change(editor, {target: {value: ""}});

    render(
      <UpdateProjectForm project={{...mockProject, content: undefined}} />
    );

    fireEvent.click(
      screen.getAllByRole("button", {name: /Update Project/i})[1]
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please add some data in content."
      );
    });
  });

  it("shows error if tags are empty on submit", async () => {
    const projectWithoutTags = {...mockProject, tags: []};
    render(<UpdateProjectForm project={projectWithoutTags} />);

    fireEvent.click(screen.getByRole("button", {name: /Update Project/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please add minimum one tags."
      );
    });
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<UpdateProjectForm project={mockProject} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
