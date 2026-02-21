import {render, screen, fireEvent} from "@testing-library/react";

import {useRemoveProjectImage} from "@/features/projects/hooks/use-projects";
import RemoveProjectImage from "@/features/projects/components/remove-project-image";

jest.mock("@/features/projects/hooks/use-projects", () => ({
  useRemoveProjectImage: jest.fn(),
}));

const mockImages = [
  {id: "img1", url: "http://test.com/img1.png"},
  {id: "img2", url: "http://test.com/img2.png"},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as any;

describe("RemoveProjectImage", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRemoveProjectImage as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("renders correctly", () => {
    render(<RemoveProjectImage id="project1" images={mockImages} />);
    expect(screen.getByText(/remove project image/i)).toBeInTheDocument();
    expect(screen.getAllByAltText("file")).toHaveLength(2);
  });

  it("calls delete handler when remove button is clicked", async () => {
    render(<RemoveProjectImage id="project1" images={mockImages} />);

    const removeButtons = screen.getAllByRole("button");
    fireEvent.click(removeButtons[0]);

    expect(mockMutate).toHaveBeenCalledWith({
      id: "project1",
      imageId: "img1",
    });
  });

  it("disables buttons when pending", () => {
    (useRemoveProjectImage as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<RemoveProjectImage id="project1" images={mockImages} />);

    const removeButtons = screen.getAllByRole("button");
    removeButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
