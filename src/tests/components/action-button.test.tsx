import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {toast} from "sonner";

import {ActionButton} from "@/components/action-button";

describe("ActionButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAction = jest.fn();

  it("matches snapshot", () => {
    const {asFragment} = render(
      <ActionButton action={mockAction}>Click Me</ActionButton>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly with children", () => {
    render(<ActionButton action={mockAction}>Click Me</ActionButton>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("calls action on click and shows success toast", async () => {
    mockAction.mockResolvedValue({error: false, message: "Success!"});
    render(<ActionButton action={mockAction}>Click Me</ActionButton>);

    fireEvent.click(screen.getByText("Click Me"));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
    expect(toast.success).toHaveBeenCalledWith("Success!");
  });

  it("calls action on click and shows error toast", async () => {
    mockAction.mockResolvedValue({error: true, message: "Failed!"});
    render(<ActionButton action={mockAction}>Click Me</ActionButton>);

    fireEvent.click(screen.getByText("Click Me"));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
    expect(toast.error).toHaveBeenCalledWith("Failed!");
  });

  it("shows default error message if no message is provided on error", async () => {
    mockAction.mockResolvedValue({error: true});
    render(<ActionButton action={mockAction}>Click Me</ActionButton>);

    fireEvent.click(screen.getByText("Click Me"));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
    expect(toast.error).toHaveBeenCalledWith("Error");
  });

  it("requires confirmation when requireAreYouSure is true", async () => {
    mockAction.mockResolvedValue({error: false, message: "Success!"});
    render(
      <ActionButton action={mockAction} requireAreYouSure={true}>
        Delete
      </ActionButton>
    );

    fireEvent.click(screen.getByText("Delete"));

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(
      screen.getByText("This action cannot be undone.")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
    expect(toast.success).toHaveBeenCalledWith("Success!");
  });

  it("can be disabled via props", () => {
    render(
      <ActionButton action={mockAction} disabled={true}>
        Disabled
      </ActionButton>
    );
    expect(screen.getByText("Disabled").closest("button")).toBeDisabled();
  });
});
