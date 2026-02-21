import {render, screen, fireEvent} from "@testing-library/react";

import {useRemoveReleaseImage} from "@/features/releases/hooks/use-releases";
import RemoveReleaseImage from "@/features/releases/components/remove-release-image";

jest.mock("@/features/releases/hooks/use-releases", () => ({
  useRemoveReleaseImage: jest.fn(),
}));

const mockImages = [
  {id: "img1", url: "http://test.com/img1.png"},
  {id: "img2", url: "http://test.com/img2.png"},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as any;

describe("RemoveReleaseImage", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRemoveReleaseImage as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("renders correctly", () => {
    render(<RemoveReleaseImage id="release1" images={mockImages} />);
    expect(
      screen.getByRole("heading", {name: /remove release image/i})
    ).toBeInTheDocument();
    expect(screen.getAllByAltText("file")).toHaveLength(2);
  });

  it("calls delete handler when remove button is clicked", async () => {
    render(<RemoveReleaseImage id="release1" images={mockImages} />);

    const removeButtons = screen.getAllByRole("button");
    fireEvent.click(removeButtons[0]);

    expect(mockMutate).toHaveBeenCalledWith({
      id: "release1",
      imageId: "img1",
    });
  });

  it("disables buttons when pending", () => {
    (useRemoveReleaseImage as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<RemoveReleaseImage id="release1" images={mockImages} />);

    const removeButtons = screen.getAllByRole("button");
    removeButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
