import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useSuspenseAllCategories} from "@/features/categories/hooks/use-categories";
import {useUploadThing} from "@/lib/uploadthing";
import {useCreateProject} from "@/features/projects/hooks/use-projects";
import CreateProjectForm from "@/features/projects/components/create-project-form";

jest.mock("@/features/categories/hooks/use-categories", () => ({
  useSuspenseAllCategories: jest.fn(),
}));
jest.mock("@/features/projects/hooks/use-projects", () => ({
  useCreateProject: jest.fn(),
}));
jest.mock("next/dynamic", () => () => {
  return function MockMDEditor({
    value,
    onChange,
  }: {
    value: string;
    onChange: (text: string) => void;
  }) {
    return (
      <textarea
        data-testid="md-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});
jest.mock("@/components/tags-input", () => ({
  TagsInput: ({
    value,
    onChange,
  }: {
    value: string[];
    onChange: (text: string[]) => void;
  }) => (
    <input
      data-testid="tags-input"
      value={value.join(",")}
      onChange={(e) => onChange(e.target.value.split(","))}
    />
  ),
}));
jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useForm: (options: any) =>
      actual.useForm({
        ...options,
        mode: "onChange",
      }),
  };
});

describe("CreateProjectForm", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockCategories = [
    {id: "cat1", name: "Category 1"},
    {id: "cat2", name: "Category 2"},
  ];

  const mockMutate = jest.fn();

  beforeAll(() => {
    if (typeof window !== "undefined") {
      window.URL.createObjectURL = jest.fn().mockReturnValue("mock-url");
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSuspenseAllCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
    });
    (useCreateProject as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useUploadThing as jest.Mock).mockReturnValue({
      startUpload: jest
        .fn()
        .mockResolvedValue([{url: "https://example.com/image.png"}]),
      isUploading: false,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({markdown: "Generated content"}),
    });
  });

  const fillRequiredFields = () => {
    fireEvent.change(screen.getByLabelText(/project title/i), {
      target: {value: "new project"},
    });
    fireEvent.change(screen.getByLabelText(/project description/i), {
      target: {value: "a new project description"},
    });

    fireEvent.change(screen.getByTestId("select-rating"), {
      target: {value: "cat1"},
    });

    fireEvent.change(screen.getByLabelText(/github url/i), {
      target: {value: "https://github.com/test"},
    });
    fireEvent.change(screen.getByLabelText(/website url/i), {
      target: {value: "https://test.com"},
    });
  };

  it("renders correctly", () => {
    render(<CreateProjectForm />);
    expect(screen.getByText(/project title/i)).toBeInTheDocument();
    expect(screen.getByText(/project description/i)).toBeInTheDocument();
    expect(screen.getAllByText(/category/i).length).toBeGreaterThan(0);
  });

  it("submits the form successfully", async () => {
    render(<CreateProjectForm />);

    fillRequiredFields();

    const fileInput = screen.getByPlaceholderText(/add project images/i);
    const file = new File(["hello"], "hello.png", {type: "image/png"});
    fireEvent.change(fileInput, {target: {files: [file]}});

    const tagsInput = screen.getByTestId("tags-input");
    fireEvent.change(tagsInput, {target: {value: "tag1,tag2"}});

    const editor = screen.getByTestId("md-editor");
    fireEvent.change(editor, {target: {value: "Some markdown content"}});

    const submitButton = screen.getByRole("button", {name: /create project/i});
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(mockMutate).toHaveBeenCalled();
      },
      {timeout: 5000}
    );
  });

  it("calls generateContent and updates editor", async () => {
    render(<CreateProjectForm />);

    fillRequiredFields();

    const generateButton = screen
      .getByText(/generate content/i)
      .closest("button");

    await waitFor(
      async () => {
        fireEvent.click(generateButton!);
        expect(global.fetch).toHaveBeenCalled();
      },
      {timeout: 5000}
    );

    await waitFor(() => {
      expect(screen.getByTestId("md-editor")).toHaveValue("Generated content");
    });
  });

  it("shows error when generateContent fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<CreateProjectForm />);

    fillRequiredFields();

    const editor = screen.getByTestId("md-editor");
    fireEvent.change(editor, {target: {value: "Some markdown content"}});

    const generateButton = screen
      .getByText(/generate content/i)
      .closest("button");

    await waitFor(
      async () => {
        fireEvent.click(generateButton!);
        expect(global.fetch).toHaveBeenCalled();
      },
      {timeout: 5000}
    );
  });

  it("shows error when content is undefined on submit", async () => {
    render(<CreateProjectForm />);

    fillRequiredFields();

    const submitButton = screen.getByRole("button", {name: /create project/i});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please add some data in content."
      );
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows error when tags are empty on submit", async () => {
    render(<CreateProjectForm />);

    fillRequiredFields();

    const editor = screen.getByTestId("md-editor");
    fireEvent.change(editor, {target: {value: "Some markdown content"}});

    const submitButton = screen.getByRole("button", {name: /create project/i});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please add minimum one tags.");
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows error when no image is added on submit", async () => {
    render(<CreateProjectForm />);

    fillRequiredFields();

    const tagsInput = screen.getByTestId("tags-input");
    fireEvent.change(tagsInput, {target: {value: "tag1,tag2"}});

    const editor = screen.getByTestId("md-editor");
    fireEvent.change(editor, {target: {value: "Some markdown content"}});

    const submitButton = screen.getByRole("button", {name: /create project/i});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please add an image.");
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows error when image upload fails", async () => {
    const mockStartUpload = jest.fn().mockResolvedValue(undefined);
    (useUploadThing as jest.Mock).mockReturnValue({
      startUpload: mockStartUpload,
      isUploading: false,
    });

    render(<CreateProjectForm />);

    fillRequiredFields();

    const tagsInput = screen.getByTestId("tags-input");
    fireEvent.change(tagsInput, {target: {value: "tag1,tag2"}});

    const editor = screen.getByTestId("md-editor");
    fireEvent.change(editor, {target: {value: "Some markdown content"}});

    const fileInput = screen.getByPlaceholderText(/add project images/i);
    const file = new File(["hello"], "hello.png", {type: "image/png"});
    fireEvent.change(fileInput, {target: {files: [file]}});

    const submitButton = screen.getByRole("button", {name: /create project/i});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Image upload failed.");
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("redirects and resets state on successful submit", async () => {
    mockMutate.mockImplementation(
      (
        _data: unknown,
        options?: {
          onSuccess?: (data: {id: string}) => void;
        }
      ) => {
        options?.onSuccess?.({id: "proj1"});
      }
    );

    render(<CreateProjectForm />);

    fillRequiredFields();

    const fileInput = screen.getByPlaceholderText(/add project images/i);
    const file = new File(["hello"], "hello.png", {type: "image/png"});
    fireEvent.change(fileInput, {target: {files: [file]}});

    const tagsInput = screen.getByTestId("tags-input");
    fireEvent.change(tagsInput, {target: {value: "tag1,tag2"}});

    const editor = screen.getByTestId("md-editor");
    fireEvent.change(editor, {target: {value: "Some markdown content"}});

    const submitButton = screen.getByRole("button", {name: /create project/i});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/project/update/proj1");
    });

    expect(screen.getByTestId("tags-input")).toHaveValue("");
    expect(screen.queryByAltText("file")).not.toBeInTheDocument();
  });

  it("shows error when non-image files are selected", () => {
    render(<CreateProjectForm />);

    const fileInput = screen.getByPlaceholderText(/add project images/i);
    const file = new File(["hello"], "hello.txt", {type: "text/plain"});
    fireEvent.change(fileInput, {target: {files: [file]}});

    expect(toast.error).toHaveBeenCalledWith("Please select image files.");
    expect(screen.queryByAltText("file")).not.toBeInTheDocument();
  });

  it("limits number of uploaded images and shows error when exceeded", () => {
    render(<CreateProjectForm />);

    const fileInput = screen.getByPlaceholderText(/add project images/i);
    const files = [
      new File(["1"], "1.png", {type: "image/png"}),
      new File(["2"], "2.png", {type: "image/png"}),
      new File(["3"], "3.png", {type: "image/png"}),
      new File(["4"], "4.png", {type: "image/png"}),
      new File(["5"], "5.png", {type: "image/png"}),
      new File(["6"], "6.png", {type: "image/png"}),
    ];
    fireEvent.change(fileInput, {target: {files}});

    expect(toast.error).toHaveBeenCalledWith("You can upload up to 5 images.");

    const images = screen.getAllByAltText("file");
    expect(images).toHaveLength(5);
  });

  it("removes an image when remove icon is clicked", () => {
    const {container} = render(<CreateProjectForm />);

    const fileInput = screen.getByPlaceholderText(/add project images/i);
    const files = [
      new File(["1"], "1.png", {type: "image/png"}),
      new File(["2"], "2.png", {type: "image/png"}),
    ];
    fireEvent.change(fileInput, {target: {files}});

    let images = screen.getAllByAltText("file");
    expect(images).toHaveLength(2);

    const removeIcons = container.querySelectorAll(
      '[data-testid="icon-XIcon"]'
    );
    fireEvent.click(removeIcons[0]);

    images = screen.getAllByAltText("file");
    expect(images).toHaveLength(1);
  });
});
