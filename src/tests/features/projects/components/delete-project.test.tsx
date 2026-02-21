import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useRemoveProject} from "@/features/projects/hooks/use-projects";
import DeleteProject from "@/features/projects/components/delete-project";

jest.mock("@/features/projects/hooks/use-projects", () => ({
  useRemoveProject: jest.fn(),
}));

describe("DeleteProject", () => {
  const mockId = "proj-123";
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRemoveProject as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("renders correctly", () => {
    render(<DeleteProject id={mockId} />);
    expect(screen.getAllByText(/delete project/i).length).toBeGreaterThan(0);
  });

  it("opens alert dialog when delete button is clicked", () => {
    render(<DeleteProject id={mockId} />);
    fireEvent.click(screen.getByTestId("alert-dialog-trigger"));
    expect(screen.getByTestId("alert-dialog-content")).toBeInTheDocument();
  });

  it("calls deleteProject.mutate when confirmed", async () => {
    render(<DeleteProject id={mockId} />);

    fireEvent.click(screen.getByTestId("alert-dialog-trigger"));
    fireEvent.click(screen.getByTestId("alert-dialog-action"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({id: mockId});
    });
  });

  it("disables button when deleting", () => {
    (useRemoveProject as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<DeleteProject id={mockId} />);
    fireEvent.click(screen.getByTestId("alert-dialog-trigger"));

    const confirmButton = screen.getByTestId("alert-dialog-action");
    expect(confirmButton).toBeDisabled();
  });
});
