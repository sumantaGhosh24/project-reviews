import {TextEncoder, TextDecoder} from "util";
import {toast} from "sonner";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import ProjectChat from "@/features/projects/components/project-chat";

Object.assign(global, {TextEncoder, TextDecoder});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("ProjectChat", () => {
  const mockSession = {
    user: {
      name: "Test User",
      image: "http://test.com/user.png",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      isPending: false,
    });
  });

  it("renders correctly", () => {
    render(<ProjectChat content="Project content" />);
    expect(screen.getByRole("button", {name: /ask ai/i})).toBeInTheDocument();
  });

  it("opens drawer and sends message", async () => {
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          value: new TextEncoder().encode("AI response"),
          done: false,
        })
        .mockResolvedValueOnce({value: undefined, done: true}),
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    render(<ProjectChat content="Project content" />);

    fireEvent.click(screen.getByRole("button", {name: /ask ai/i}));

    expect(
      screen.getByText(/Ask AI anything about the project/i)
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText(
      /ask something about the project/i
    );
    const sendButton = screen.getByRole("button", {name: /send/i});

    fireEvent.change(input, {target: {value: "Hello AI"}});
    fireEvent.click(sendButton);

    expect(screen.getByText("Hello AI")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("AI response")).toBeInTheDocument();
    });
  });

  it("does not send message if input is empty", () => {
    global.fetch = jest.fn();

    render(<ProjectChat content="Project content" />);

    fireEvent.click(screen.getByRole("button", {name: /ask ai/i}));

    const sendButton = screen.getByRole("button", {name: /send/i});
    fireEvent.click(sendButton);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("handles fetch errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

    render(<ProjectChat content="Project content" />);

    fireEvent.click(screen.getByRole("button", {name: /ask ai/i}));

    const input = screen.getByPlaceholderText(
      /ask something about the project/i
    );
    fireEvent.change(input, {target: {value: "Test error"}});

    const sendButton = screen.getByRole("button", {name: /send/i});
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("API Error");
    });
  });

  it("sends message when Enter key is pressed", async () => {
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          value: new TextEncoder().encode("AI response"),
          done: false,
        })
        .mockResolvedValueOnce({value: undefined, done: true}),
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    render(<ProjectChat content="Project content" />);

    fireEvent.click(screen.getByRole("button", {name: /ask ai/i}));

    const input = screen.getByPlaceholderText(
      /ask something about the project/i
    );

    fireEvent.change(input, {target: {value: "Hello via Enter"}});
    fireEvent.keyDown(input, {key: "Enter", code: "Enter"});

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/project-chat",
      expect.any(Object)
    );

    await waitFor(() => {
      expect(screen.getByText("Hello via Enter")).toBeInTheDocument();
    });
  });

  it("shows skeleton while loading session", () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
    });

    render(<ProjectChat content="Project content" />);
    expect(screen.queryByText(/ask ai/i)).not.toBeInTheDocument();
  });
});
