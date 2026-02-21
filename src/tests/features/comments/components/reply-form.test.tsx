/* eslint-disable @typescript-eslint/no-explicit-any */
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useUploadThing} from "@/lib/uploadthing";
import {useReplyComment} from "@/features/comments/hooks/use-comments";
import {ReplyForm} from "@/features/comments/components/reply-form";

jest.mock("@/features/comments/hooks/use-comments", () => ({
  useReplyComment: jest.fn(),
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

describe("ReplyForm", () => {
  const mockMutate = jest.fn();
  const mockStartUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useReplyComment as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useUploadThing as jest.Mock).mockReturnValue({
      startUpload: mockStartUpload,
      isUploading: false,
    });
  });

  it("renders the form", () => {
    render(<ReplyForm commentId="c1" releaseId="r1" />);
    expect(
      screen.getByPlaceholderText("Enter your message...")
    ).toBeInTheDocument();
  });

  it("submits the form with body only", async () => {
    render(<ReplyForm commentId="c1" releaseId="r1" />);

    const textarea = screen.getByPlaceholderText("Enter your message...");
    fireEvent.change(textarea, {target: {value: "test reply"}});

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          body: "test reply",
          commentId: "c1",
          releaseId: "r1",
        }),
        expect.any(Object)
      );
    });
  });

  it("handles image selection", async () => {
    mockStartUpload.mockResolvedValue([{ufsUrl: "https://uploaded-image.com"}]);
    render(<ReplyForm commentId="c1" releaseId="r1" />);

    const file = new File(["dummy content"], "test.png", {type: "image/png"});

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(fileInput, {target: {files: [file]}});

    const textarea = screen.getByPlaceholderText("Enter your message...");
    fireEvent.change(textarea, {target: {value: "test reply with image"}});

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          body: "test reply with image",
          imageUrl: "https://uploaded-image.com",
        }),
        expect.any(Object)
      );
      expect(mockStartUpload).toHaveBeenCalled();
    });
  });

  it("resets form after successful submit", async () => {
    mockMutate.mockImplementation((variables, options) => {
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    });

    render(<ReplyForm commentId="c1" releaseId="r1" />);

    const textarea = screen.getByPlaceholderText("Enter your message...");
    fireEvent.change(textarea, {target: {value: "test reply"}});

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
      expect(textarea).toHaveValue("");
    });
  });

  it("does not process non-image files in handleImage", async () => {
    const readSpy = jest.spyOn((FileReader as any).prototype, "readAsDataURL");

    render(<ReplyForm commentId="c1" releaseId="r1" />);

    const file = new File(["dummy content"], "test.txt", {
      type: "text/plain",
    });

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(fileInput, {target: {files: [file]}});

    await waitFor(() => {
      expect(readSpy).not.toHaveBeenCalled();
    });
  });
});
