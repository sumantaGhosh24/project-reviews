import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useUploadThing} from "@/lib/uploadthing";
import {useCreateRelease} from "@/features/releases/hooks/use-releases";
import CreateReleaseForm from "@/features/releases/components/create-release-form";

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    return ({
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
  },
}));
jest.mock("@/features/releases/hooks/use-releases", () => ({
  useCreateRelease: jest.fn(),
}));

describe("CreateReleaseForm", () => {
  const mockCreateRelease = {
    mutateAsync: jest.fn(),
    isPending: false,
  };

  const mockStartUpload = jest.fn();
  const mockRouter = {
    push: jest.fn(),
  };

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (useCreateRelease as jest.Mock).mockReturnValue(mockCreateRelease);
    (useUploadThing as jest.Mock).mockReturnValue({
      startUpload: mockStartUpload,
      isUploading: false,
    });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn();
    global.URL.createObjectURL = jest.fn(() => "blob:test");
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<CreateReleaseForm projectId="proj1" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("updates form fields correctly", async () => {
    render(<CreateReleaseForm projectId="proj1" />);

    fireEvent.change(screen.getByLabelText(/Release Title/i), {
      target: {value: "New Release"},
    });
    fireEvent.change(screen.getByLabelText(/Release Description/i), {
      target: {value: "New Description"},
    });

    expect(screen.getByLabelText(/Release Title/i)).toHaveValue("New Release");
    expect(screen.getByLabelText(/Release Description/i)).toHaveValue(
      "New Description"
    );
  });

  it("calls generateContent and updates MDEditor", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({markdown: "AI Generated Content"}),
    });

    render(<CreateReleaseForm projectId="proj1" />);

    fireEvent.change(screen.getByLabelText(/Release Title/i), {
      target: {value: "Test"},
    });
    fireEvent.change(screen.getByLabelText(/Release Description/i), {
      target: {value: "Test"},
    });

    fireEvent.click(screen.getByText(/Generate Content Using AI/i));

    const mdEditor = await screen.findByTestId("md-editor");
    await waitFor(() => {
      expect(mdEditor).toHaveValue("AI Generated Content");
    });
  });

  it("does not call generateContent when title or description is empty", async () => {
    render(<CreateReleaseForm projectId="proj1" />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Release Title/i)).toHaveValue("");
      expect(screen.getByLabelText(/Release Description/i)).toHaveValue("");
    });

    fireEvent.click(screen.getByText(/Generate Content Using AI/i));

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it("shows error toast when generateContent fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<CreateReleaseForm projectId="proj1" />);

    fireEvent.change(screen.getByLabelText(/Release Title/i), {
      target: {value: "Test"},
    });
    fireEvent.change(screen.getByLabelText(/Release Description/i), {
      target: {value: "Test"},
    });

    fireEvent.click(screen.getByText(/Generate Content Using AI/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("API Error");
    });
  });

  it("shows error if content is missing on submit", async () => {
    render(<CreateReleaseForm projectId="proj1" />);

    fireEvent.change(screen.getByLabelText(/Release Title/i), {
      target: {value: "Test"},
    });
    fireEvent.change(screen.getByLabelText(/Release Description/i), {
      target: {value: "Test"},
    });

    fireEvent.click(screen.getByRole("button", {name: /Create Release/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please add some data in content."
      );
    });
  });

  it("shows error if no images are selected on submit", async () => {
    render(<CreateReleaseForm projectId="proj1" />);

    fireEvent.change(screen.getByLabelText(/Release Title/i), {
      target: {value: "Test"},
    });
    fireEvent.change(screen.getByLabelText(/Release Description/i), {
      target: {value: "Test"},
    });

    const mdEditor = await screen.findByTestId("md-editor");
    fireEvent.change(mdEditor, {
      target: {value: "Some content"},
    });

    fireEvent.click(screen.getByRole("button", {name: /Create Release/i}));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please add an image.");
    });
  });

  it("handles image selection and removal", async () => {
    render(<CreateReleaseForm projectId="proj1" />);

    const file = new File(["dummy content"], "test.png", {type: "image/png"});
    const input = screen.getByLabelText(/Select Release Images/i);

    fireEvent.change(input, {target: {files: [file]}});

    expect(screen.getByAltText("file")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("icon-XIcon"));
    expect(screen.queryByAltText("file")).not.toBeInTheDocument();
  });

  it("shows error when selected files are not images", async () => {
    render(<CreateReleaseForm projectId="proj1" />);

    const file = new File(["dummy content"], "test.txt", {type: "text/plain"});
    const input = screen.getByLabelText(/Select Release Images/i);

    fireEvent.change(input, {target: {files: [file]}});

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please select image files.");
    });
    expect(screen.queryByAltText("file")).not.toBeInTheDocument();
  });

  it("limits image uploads to maximum count and shows error", async () => {
    render(<CreateReleaseForm projectId="proj1" />);

    const files = Array.from({length: 6}).map(
      (_, i) => new File(["dummy"], `img${i}.png`, {type: "image/png"})
    );
    const input = screen.getByLabelText(/Select Release Images/i);

    fireEvent.change(input, {target: {files}});

    await waitFor(() => {
      expect(screen.getAllByAltText("file").length === 5).toBeTruthy();
    });
    expect(toast.error).toHaveBeenCalledWith("You can upload up to 5 images.");
  });

  it("submits the form successfully", async () => {
    mockStartUpload.mockResolvedValue([
      {ufsUrl: "https://example.com/img.png"},
    ]);
    const mockMutate = jest.fn();
    (useCreateRelease as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<CreateReleaseForm projectId="proj1" />);

    fireEvent.change(screen.getByLabelText(/Release Title/i), {
      target: {value: "Release Title"},
    });
    fireEvent.change(screen.getByLabelText(/Release Description/i), {
      target: {value: "Release Desc"},
    });

    const mdEditor = await screen.findByTestId("md-editor");
    fireEvent.change(mdEditor, {
      target: {value: "Some content"},
    });

    const file = new File(["dummy content"], "test.png", {type: "image/png"});
    fireEvent.change(screen.getByLabelText(/Select Release Images/i), {
      target: {files: [file]},
    });

    fireEvent.click(screen.getByRole("button", {name: /Create Release/i}));

    await waitFor(() => {
      expect(mockStartUpload).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "release title",
          description: "release desc",
          content: "Some content",
          imageUrl: ["https://example.com/img.png"],
          projectId: "proj1",
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        })
      );
    });
  });

  it("handles image upload failure gracefully", async () => {
    mockStartUpload.mockResolvedValue([]);
    const mockMutate = jest.fn();
    (useCreateRelease as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<CreateReleaseForm projectId="proj1" />);

    fireEvent.change(screen.getByLabelText(/Release Title/i), {
      target: {value: "Release Title"},
    });
    fireEvent.change(screen.getByLabelText(/Release Description/i), {
      target: {value: "Release Desc"},
    });

    const mdEditor = await screen.findByTestId("md-editor");
    fireEvent.change(mdEditor, {
      target: {value: "Some content"},
    });

    const file = new File(["dummy content"], "test.png", {type: "image/png"});
    fireEvent.change(screen.getByLabelText(/Select Release Images/i), {
      target: {files: [file]},
    });

    fireEvent.click(screen.getByRole("button", {name: /Create Release/i}));

    await waitFor(() => {
      expect(mockStartUpload).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Image upload failed.");
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("redirects and resets state on successful submit", async () => {
    mockStartUpload.mockResolvedValue([
      {ufsUrl: "https://example.com/img.png"},
    ]);
    const mockMutate = jest.fn(
      (
        _data: unknown,
        options?: {
          onSuccess?: (data: {id: string}) => void;
        }
      ) => {
        options?.onSuccess?.({id: "rel1"});
      }
    );
    (useCreateRelease as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<CreateReleaseForm projectId="proj1" />);

    fireEvent.change(screen.getByLabelText(/Release Title/i), {
      target: {value: "Release Title"},
    });
    fireEvent.change(screen.getByLabelText(/Release Description/i), {
      target: {value: "Release Desc"},
    });

    const mdEditor = await screen.findByTestId("md-editor");
    fireEvent.change(mdEditor, {
      target: {value: "Some content"},
    });

    const file = new File(["dummy content"], "test.png", {type: "image/png"});
    fireEvent.change(screen.getByLabelText(/Select Release Images/i), {
      target: {files: [file]},
    });

    fireEvent.click(screen.getByRole("button", {name: /Create Release/i}));

    await waitFor(() => {
      expect(mockStartUpload).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith(
        "/project/details/rel1/release/rel1/update"
      );
    });
  });
});
