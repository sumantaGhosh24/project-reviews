import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useUploadThing} from "@/lib/uploadthing";
import {useAddProjectImage} from "@/features/projects/hooks/use-projects";
import AddProjectImage from "@/features/projects/components/add-project-image";

jest.mock("@/features/projects/hooks/use-projects", () => ({
  useAddProjectImage: jest.fn(),
}));

const mockProject = {
  id: "project1",
  title: "Test Project",
  description: "Description",
  userId: "user1",
  categoryId: "cat1",
  githubUrl: "https://github.com",
  websiteUrl: "https://test.com",
  imageUrl: [],
  content: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe("AddProjectImage", () => {
  const mockMutate = jest.fn();
  const mockStartUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAddProjectImage as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useUploadThing as jest.Mock).mockReturnValue({
      startUpload: mockStartUpload,
      isUploading: false,
    });
    if (typeof window !== "undefined") {
      window.URL.createObjectURL = jest.fn().mockReturnValue("mock-url");
    }
  });

  it("renders correctly", () => {
    render(<AddProjectImage project={mockProject} />);
    expect(
      screen.getByRole("heading", {name: /add project image/i})
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/select project images/i)).toBeInTheDocument();
  });

  it("handles image selection and removal", async () => {
    render(<AddProjectImage project={mockProject} />);
    const fileInput = screen.getByLabelText(/select project images/i);
    const file = new File(["hello"], "hello.png", {type: "image/png"});

    fireEvent.change(fileInput, {target: {files: [file]}});

    expect(screen.getByAltText("file")).toBeInTheDocument();

    const removeButton = screen.getByTestId("icon-XIcon");
    fireEvent.click(removeButton);

    expect(screen.queryByAltText("file")).not.toBeInTheDocument();
  });

  it("shows error when uploading more than 5 images", () => {
    render(<AddProjectImage project={mockProject} />);
    const fileInput = screen.getByLabelText(/select project images/i);
    const files = Array(6)
      .fill(null)
      .map((_, i) => new File(["hello"], `hello${i}.png`, {type: "image/png"}));

    fireEvent.change(fileInput, {target: {files}});

    expect(toast.error).toHaveBeenCalledWith("You can upload up to 5 images.");
    expect(screen.getAllByAltText("file")).toHaveLength(5);
  });

  it("submits the form successfully", async () => {
    mockStartUpload.mockResolvedValue([{ufsUrl: "uploaded-url"}]);
    render(<AddProjectImage project={mockProject} />);

    const fileInput = screen.getByLabelText(/select project images/i);
    const file = new File(["hello"], "hello.png", {type: "image/png"});
    fireEvent.change(fileInput, {target: {files: [file]}});

    const submitButton = screen.getByRole("button", {
      name: /add project image/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockStartUpload).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockProject.id,
          imageUrl: ["uploaded-url"],
        }),
        expect.any(Object)
      );
    });
  });

  it("shows error if no image selected", async () => {
    render(<AddProjectImage project={mockProject} />);
    const submitButton = screen.getByRole("button", {
      name: /add project image/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please add an image.");
    });
    expect(mockStartUpload).not.toHaveBeenCalled();
  });

  it("shows error if upload fails", async () => {
    mockStartUpload.mockResolvedValue(null);
    render(<AddProjectImage project={mockProject} />);

    const fileInput = screen.getByLabelText(/select project images/i);
    const file = new File(["hello"], "hello.png", {type: "image/png"});
    fireEvent.change(fileInput, {target: {files: [file]}});

    const submitButton = screen.getByRole("button", {
      name: /add project image/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Image upload failed.");
    });
  });
});
