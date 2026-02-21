/* eslint-disable @typescript-eslint/no-explicit-any */
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useUploadThing} from "@/lib/uploadthing";
import {authClient} from "@/lib/auth/auth-client";
import {ProfileUpdateImageForm} from "@/features/profile/components/profile-update-image-form";

class MockFileReader {
  onload: any;
  readAsDataURL() {
    setTimeout(() => {
      this.onload({target: {result: "data:image/png;base64,test"}});
    }, 0);
  }
}
global.FileReader = MockFileReader as any;

describe("ProfileUpdateImageForm", () => {
  const mockRouter = {
    refresh: jest.fn(),
  };

  const mockStartUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useUploadThing as jest.Mock).mockReturnValue({
      startUpload: mockStartUpload,
      isUploading: false,
    });
  });

  it("renders with current image", () => {
    render(<ProfileUpdateImageForm image="https://example.com/image.png" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("example.com"));
  });

  it("updates image and calls updateUser", async () => {
    mockStartUpload.mockResolvedValue([
      {ufsUrl: "https://ufs.sh/new-image.png"},
    ]);
    (authClient.updateUser as jest.Mock).mockResolvedValue({
      data: {},
      error: null,
    });

    render(<ProfileUpdateImageForm image="https://example.com/image.png" />);

    const file = new File(["test"], "test.png", {type: "image/png"});
    const input = screen.getByPlaceholderText(/add profile photo/i);

    fireEvent.change(input, {target: {files: [file]}});

    await waitFor(() => {
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", expect.stringContaining("base64"));
    });

    fireEvent.submit(
      screen.getByRole("button", {name: /update profile image/i})
    );

    await waitFor(() => {
      expect(mockStartUpload).toHaveBeenCalled();
      expect(authClient.updateUser).toHaveBeenCalledWith({
        image: "https://ufs.sh/new-image.png",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Profile image updated successfully"
      );
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("shows error toast if upload fails", async () => {
    mockStartUpload.mockResolvedValue(null);
    (authClient.updateUser as jest.Mock).mockResolvedValue({
      data: {},
      error: null,
    });

    render(<ProfileUpdateImageForm image="https://example.com/image.png" />);

    const file = new File(["test"], "test.png", {type: "image/png"});
    const input = screen.getByPlaceholderText(/add profile photo/i);
    fireEvent.change(input, {target: {files: [file]}});

    await waitFor(() => {
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        expect.stringContaining("base64")
      );
    });

    fireEvent.submit(
      screen.getByRole("button", {name: /update profile image/i})
    );

    await waitFor(() => {
      expect(mockStartUpload).toHaveBeenCalled();
    });
  });

  it("shows error toast if updateUser fails", async () => {
    mockStartUpload.mockResolvedValue([
      {ufsUrl: "https://ufs.sh/new-image.png"},
    ]);
    (authClient.updateUser as jest.Mock).mockResolvedValue({
      error: {message: "Update failed"},
    });

    render(<ProfileUpdateImageForm image="https://example.com/image.png" />);

    const file = new File(["test"], "test.png", {type: "image/png"});
    const input = screen.getByPlaceholderText(/add profile photo/i);
    fireEvent.change(input, {target: {files: [file]}});

    await waitFor(() => {
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        expect.stringContaining("base64")
      );
    });

    fireEvent.submit(
      screen.getByRole("button", {name: /update profile image/i})
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Update failed");
    });
  });
});
