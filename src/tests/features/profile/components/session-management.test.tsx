/* eslint-disable @typescript-eslint/no-explicit-any */
import {useRouter} from "next/navigation";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";

import {authClient} from "@/lib/auth/auth-client";
import {SessionManagement} from "@/features/profile/components/session-management";

jest.mock("@/features/auth/components/auth-action-button", () => ({
  AuthActionButton: jest.fn(({children, action}) => (
    <button onClick={action}>{children}</button>
  )),
}));

describe("SessionManagement", () => {
  const mockRouter = {
    refresh: jest.fn(),
  };

  const mockSessions = [
    {
      id: "s1",
      token: "token1",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      createdAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
    },
    {
      id: "s2",
      token: "token2",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1",
      createdAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders sessions correctly", () => {
    render(
      <SessionManagement
        sessions={mockSessions as any}
        currentSessionToken="token1"
      />
    );

    expect(screen.getByText(/current session/i)).toBeInTheDocument();
    expect(screen.getByText(/Chrome, Windows/i)).toBeInTheDocument();
    expect(screen.getByText(/Mobile Safari, iOS/i)).toBeInTheDocument();
  });

  it("calls revokeOtherSessions when button is clicked", async () => {
    (authClient.revokeOtherSessions as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
        return Promise.resolve();
      }
    );

    render(
      <SessionManagement
        sessions={mockSessions as any}
        currentSessionToken="token1"
      />
    );

    fireEvent.click(screen.getByText(/revoke other sessions/i));

    await waitFor(() => {
      expect(authClient.revokeOtherSessions).toHaveBeenCalled();
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("calls revokeSession when individual session revoke button is clicked", async () => {
    (authClient.revokeSession as jest.Mock).mockImplementation(
      (data, options) => {
        options.onSuccess();
        return Promise.resolve();
      }
    );

    render(
      <SessionManagement
        sessions={mockSessions as any}
        currentSessionToken="token1"
      />
    );

    const revokeButtons = screen.getAllByTestId("icon-Trash2Icon");
    fireEvent.click(revokeButtons[0].closest("button")!);

    await waitFor(() => {
      expect(authClient.revokeSession).toHaveBeenCalledWith(
        {token: "token2"},
        expect.any(Object)
      );
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
});
