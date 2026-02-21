import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import ReleaseChat from "@/features/releases/components/release-chat";

describe("ReleaseChat", () => {
  const mockSession = {
    user: {
      name: "Test User",
      image: "https://example.com/user.png",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      isPending: false,
    });

    global.fetch = jest.fn();
    global.TextDecoder = jest.fn().mockImplementation(() => ({
      decode: jest.fn((value) => value),
    }));
  });

  it("renders the Ask AI button", () => {
    render(<ReleaseChat content="Test content" />);
    expect(screen.getByRole("button", {name: /Ask AI/i})).toBeInTheDocument();
  });

  it("shows skeleton when session is pending", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
    });

    render(<ReleaseChat content="Test content" />);
    expect(
      document.querySelector('[data-slot="skeleton"]')
    ).toBeInTheDocument();
  });

  it("sends a message and receives a streamed response", async () => {
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({value: "Hello", done: false})
        .mockResolvedValueOnce({value: " there!", done: false})
        .mockResolvedValueOnce({value: "", done: true}),
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    render(<ReleaseChat content="Test content" />);

    const input = screen.getByPlaceholderText(
      /Ask something about the release/i
    );
    fireEvent.change(input, {target: {value: "What is this release?"}});

    const sendButton = screen.getByText(/Send/i);
    fireEvent.click(sendButton);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/release-chat",
      expect.any(Object)
    );

    await waitFor(() => {
      expect(screen.getByText("Hello there!")).toBeInTheDocument();
    });

    expect(screen.getByText("What is this release?")).toBeInTheDocument();
  });

  it("handles fetch errors", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<ReleaseChat content="Test content" />);

    const input = screen.getByPlaceholderText(
      /Ask something about the release/i
    );
    fireEvent.change(input, {target: {value: "Test error"}});

    const sendButton = screen.getByText(/Send/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("API Error");
    });
  });

  it("does not send message if input is empty", () => {
    render(<ReleaseChat content="Test content" />);

    const sendButton = screen.getByText(/Send/i);
    fireEvent.click(sendButton);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("sends message when Enter key is pressed", async () => {
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({value: "Hello", done: false})
        .mockResolvedValueOnce({value: " there!", done: false})
        .mockResolvedValueOnce({value: "", done: true}),
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    render(<ReleaseChat content="Test content" />);

    const input = screen.getByPlaceholderText(
      /Ask something about the release/i
    );
    fireEvent.change(input, {target: {value: "Hello via Enter"}});

    fireEvent.keyDown(input, {key: "Enter", code: "Enter"});

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/release-chat",
      expect.any(Object)
    );

    await waitFor(() => {
      expect(screen.getByText("Hello there!")).toBeInTheDocument();
    });

    expect(screen.getByText("Hello via Enter")).toBeInTheDocument();
  });
});
