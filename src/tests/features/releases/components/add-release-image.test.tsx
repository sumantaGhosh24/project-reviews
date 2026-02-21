import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useUploadThing} from "@/lib/uploadthing";
import {useAddReleaseImage} from "@/features/releases/hooks/use-releases";
import AddReleaseImage from "@/features/releases/components/add-release-image";

jest.mock("@/features/releases/hooks/use-releases", () => ({
  useAddReleaseImage: jest.fn(),
}));

const mockRelease = {
  id: "release1",
  title: "Test Release",
  description: "Description",
  projectId: "project1",
  status: "DRAFT",
  visibility: "PRIVATE",
  imageUrl: [],
  content: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe("AddReleaseImage", () => {
  const mockMutate = jest.fn();
  const mockStartUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAddReleaseImage as jest.Mock).mockReturnValue({
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
    render(<AddReleaseImage release={mockRelease} />);
    expect(
      screen.getByRole("heading", {name: /add release image/i})
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/select release images/i)).toBeInTheDocument();
  });

  it("handles image selection and removal", async () => {
    render(<AddReleaseImage release={mockRelease} />);
    const fileInput = screen.getByLabelText(/select release images/i);
    const file = new File(["hello"], "hello.png", {type: "image/png"});

    fireEvent.change(fileInput, {target: {files: [file]}});

    expect(screen.getByAltText("file")).toBeInTheDocument();

    const removeButton = screen.getByTestId("icon-XIcon");
    fireEvent.click(removeButton);

    expect(screen.queryByAltText("file")).not.toBeInTheDocument();
  });

  it("shows error when uploading more than 5 images", () => {
    render(<AddReleaseImage release={mockRelease} />);
    const fileInput = screen.getByLabelText(/select release images/i);
    const files = Array(6)
      .fill(null)
      .map((_, i) => new File(["hello"], `hello${i}.png`, {type: "image/png"}));

    fireEvent.change(fileInput, {target: {files}});

    expect(toast.error).toHaveBeenCalledWith("You can upload up to 5 images.");
    expect(screen.getAllByAltText("file")).toHaveLength(5);
  });

  it("submits the form successfully", async () => {
    mockStartUpload.mockResolvedValue([{ufsUrl: "uploaded-url"}]);
    render(<AddReleaseImage release={mockRelease} />);

    const fileInput = screen.getByLabelText(/select release images/i);
    const file = new File(["hello"], "hello.png", {type: "image/png"});
    fireEvent.change(fileInput, {target: {files: [file]}});

    const submitButton = screen.getByRole("button", {
      name: /add release image/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockStartUpload).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockRelease.id,
          imageUrl: ["uploaded-url"],
        }),
        expect.any(Object)
      );
    });
  });

  it("shows error if no image selected", async () => {
    render(<AddReleaseImage release={mockRelease} />);
    const submitButton = screen.getByRole("button", {
      name: /add release image/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please add an image.");
    });
    expect(mockStartUpload).not.toHaveBeenCalled();
  });

  it("shows error when image upload fails", async () => {
    mockStartUpload.mockResolvedValue([]);
    render(<AddReleaseImage release={mockRelease} />);

    const fileInput = screen.getByLabelText(/select release images/i);
    const file = new File(["hello"], "hello.png", {type: "image/png"});
    fireEvent.change(fileInput, {target: {files: [file]}});

    const submitButton = screen.getByRole("button", {
      name: /add release image/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockStartUpload).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Image upload failed.");
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("clears selected images on successful submit", async () => {
    mockStartUpload.mockResolvedValue([{ufsUrl: "uploaded-url"}]);
    mockMutate.mockImplementation(
      (
        _variables: unknown,
        options?: {
          onSuccess?: () => void;
        }
      ) => {
        options?.onSuccess?.();
      }
    );

    render(<AddReleaseImage release={mockRelease} />);

    const fileInput = screen.getByLabelText(/select release images/i);
    const file = new File(["hello"], "hello.png", {type: "image/png"});
    fireEvent.change(fileInput, {target: {files: [file]}});

    expect(screen.getByAltText("file")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: /add release image/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockStartUpload).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalled();
      expect(screen.queryByAltText("file")).not.toBeInTheDocument();
    });
  });

  it("shows error when selected files are not images", () => {
    render(<AddReleaseImage release={mockRelease} />);
    const fileInput = screen.getByLabelText(/select release images/i);
    const file = new File(["hello"], "hello.txt", {type: "text/plain"});

    fireEvent.change(fileInput, {target: {files: [file]}});

    expect(toast.error).toHaveBeenCalledWith("Please select image files.");
    expect(screen.queryByAltText("file")).not.toBeInTheDocument();
  });
});
