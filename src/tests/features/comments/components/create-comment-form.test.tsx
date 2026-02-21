/* eslint-disable @typescript-eslint/no-explicit-any */
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useUploadThing} from "@/lib/uploadthing";
import {useCreateComment} from "@/features/comments/hooks/use-comments";
import {CreateCommentForm} from "@/features/comments/components/create-comment-form";

jest.mock("@/features/comments/hooks/use-comments", () => ({
  useCreateComment: jest.fn(),
}));
jest.mock("@/components/loading-swap", () => ({
  LoadingSwap: ({children}: any) => <div>{children}</div>,
}));
jest.mock("@/lib/utils", () => {
  const actual = jest.requireActual("@/lib/utils");
  return {
    ...actual,
    isBase64Image: jest.fn(() => true),
  };
});

describe("CreateCommentForm", () => {
  const mockMutate = jest.fn();
  const mockStartUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateComment as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useUploadThing as jest.Mock).mockReturnValue({
      startUpload: mockStartUpload,
      isUploading: false,
    });
  });

  it("renders the form", () => {
    render(<CreateCommentForm releaseId="r1" />);
    expect(
      screen.getByPlaceholderText("Enter your message...")
    ).toBeInTheDocument();
  });

  it("submits the form with body only", async () => {
    render(<CreateCommentForm releaseId="r1" />);

    const textarea = screen.getByPlaceholderText("Enter your message...");
    fireEvent.change(textarea, {target: {value: "test comment"}});

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          body: "test comment",
          releaseId: "r1",
        }),
        expect.any(Object)
      );
    });
  });

  it("handles image selection", async () => {
    mockStartUpload.mockResolvedValue([{ufsUrl: "https://uploaded-image.com"}]);
    render(<CreateCommentForm releaseId="r1" />);

    const file = new File(["dummy content"], "test.png", {type: "image/png"});

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(fileInput, {target: {files: [file]}});

    const textarea = screen.getByPlaceholderText("Enter your message...");
    fireEvent.change(textarea, {target: {value: "test comment with image"}});

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          body: "test comment with image",
          imageUrl: "https://uploaded-image.com",
        }),
        expect.any(Object)
      );
      expect(mockStartUpload).toHaveBeenCalled();
    });
  });

  it("does not process non-image files in handleImage", async () => {
    const readSpy = jest.spyOn((FileReader as any).prototype, "readAsDataURL");

    render(<CreateCommentForm releaseId="r1" />);

    const file = new File(["dummy"], "test.txt", {type: "text/plain"});
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(fileInput, {target: {files: [file]}});

    await waitFor(() => {
      expect(readSpy).not.toHaveBeenCalled();
    });
  });

  it("resets form after successful submit", async () => {
    mockMutate.mockImplementation((variables, options) => {
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    });

    render(<CreateCommentForm releaseId="r1" />);

    const textarea = screen.getByPlaceholderText("Enter your message...");
    fireEvent.change(textarea, {target: {value: "test comment"}});

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
      expect(textarea).toHaveValue("");
    });
  });
});
