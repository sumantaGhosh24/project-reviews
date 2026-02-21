import {useTheme} from "next-themes";
import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {useUpdateRelease} from "@/features/releases/hooks/use-releases";
import UpdateReleaseForm from "@/features/releases/components/update-release-form";

jest.mock("@/features/releases/hooks/use-releases", () => ({
  useUpdateRelease: jest.fn(),
}));
jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    return function MockMDEditor(props: {
      value: string;
      onChange: (value: string) => void;
    }) {
      return (
        <textarea
          data-testid="md-editor"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      );
    };
  },
}));
jest.mock("@/components/loading-swap", () => ({
  LoadingSwap: ({
    children,
    isLoading,
  }: {
    children: React.ReactNode;
    isLoading: boolean;
  }) => <div>{isLoading ? "Loading..." : children}</div>,
}));

const mockRelease = {
  id: "release1",
  projectId: "project1",
  title: "old title",
  description: "old description",
  status: "DRAFT",
  visibility: "PRIVATE",
  content: "old content",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe("UpdateReleaseForm", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUpdateRelease as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useTheme as jest.Mock).mockReturnValue({theme: "light"});
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({markdown: "Generated content"}),
    });
  });

  it("renders correctly with initial values", () => {
    render(<UpdateReleaseForm release={mockRelease} />);
    expect(screen.getByLabelText(/release title/i)).toHaveValue("old title");
    expect(screen.getByLabelText(/release description/i)).toHaveValue(
      "old description"
    );
    expect(screen.getByTestId("md-editor")).toHaveValue("old content");
  });

  it("submits the form successfully", async () => {
    render(<UpdateReleaseForm release={mockRelease} />);

    fireEvent.change(screen.getByLabelText(/release title/i), {
      target: {value: "new title"},
    });
    fireEvent.change(screen.getByLabelText(/release description/i), {
      target: {value: "new description"},
    });

    const submitButton = screen.getByRole("button", {name: /update release/i});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: "release1",
        projectId: "project1",
        title: "new title",
        description: "new description",
        content: "old content",
        status: "DRAFT",
        visibility: "PRIVATE",
      });
    });
  });

  it("calls generateContent and updates editor", async () => {
    render(<UpdateReleaseForm release={mockRelease} />);

    const generateButton = screen
      .getByText(/update content using ai/i)
      .closest("button");
    fireEvent.click(generateButton!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(screen.getByTestId("md-editor")).toHaveValue("Generated content");
    });
  });

  it("shows error when generateContent fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<UpdateReleaseForm release={mockRelease} />);

    const generateButton = screen
      .getByText(/update content using ai/i)
      .closest("button");
    fireEvent.click(generateButton!);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("API Error");
    });
  });

  it("shows error when content is undefined on submit", async () => {
    render(
      <UpdateReleaseForm
        release={{
          ...mockRelease,
          content: undefined,
        }}
      />
    );

    const submitButton = screen.getByRole("button", {name: /update release/i});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please add some data in content."
      );
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });
});
