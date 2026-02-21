import {useRouter} from "next/navigation";
import {render, screen, fireEvent} from "@testing-library/react";

import {useRemoveRelease} from "@/features/releases/hooks/use-releases";
import DeleteRelease from "@/features/releases/components/delete-release";

jest.mock("@/features/releases/hooks/use-releases", () => ({
  useRemoveRelease: jest.fn(),
}));

describe("DeleteRelease", () => {
  const mockRemoveRelease = {
    mutate: jest.fn(),
    isPending: false,
  };

  const mockRouter = {
    back: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRemoveRelease as jest.Mock).mockReturnValue(mockRemoveRelease);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("matches snapshot", () => {
    const {asFragment} = render(<DeleteRelease id="rel1" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("opens alert dialog when delete button is clicked", () => {
    render(<DeleteRelease id="rel1" />);
    fireEvent.click(
      screen.getAllByRole("button", {name: /Delete Release/i})[0]
    );
    expect(screen.getByText(/Are you absolutely sure/i)).toBeInTheDocument();
  });

  it("calls deleteRelease mutate when confirmed", () => {
    render(<DeleteRelease id="rel1" />);

    fireEvent.click(
      screen.getAllByRole("button", {name: /Delete Release/i})[0]
    );

    const actionButtons = screen.getAllByRole("button", {
      name: /Delete Release/i,
    });

    const actionButton = screen.getByTestId("alert-dialog-action");
    fireEvent.click(actionButton);

    expect(mockRemoveRelease.mutate).toHaveBeenCalled();
    const mutateArgs = mockRemoveRelease.mutate.mock.calls[0];
    expect(mutateArgs[0]).toEqual({id: "rel1"});

    mutateArgs[1].onSuccess();
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("disables the action button when pending", () => {
    (useRemoveRelease as jest.Mock).mockReturnValue({
      ...mockRemoveRelease,
      isPending: true,
    });

    render(<DeleteRelease id="rel1" />);

    const actionButton = screen.getByTestId("alert-dialog-action");
    expect(actionButton).toBeDisabled();
    expect(screen.getByTestId("icon-Loader2Icon")).toBeInTheDocument();
  });
});
