import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchUser} from "@/features/profile/server/prefetch";
import ProfilePage, {metadata} from "@/app/profile/[id]/details/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/profile/server/prefetch");
jest.mock("@/features/profile/components/profile-details", () => {
  return function MockProfileDetails({id}: {id: string}) {
    return <div data-testid="profile-details">Profile Details {id}</div>;
  };
});
jest.mock("@/features/global/components/error-component", () => {
  return function MockErrorComponent() {
    return <div data-testid="error-component">Error</div>;
  };
});
jest.mock("@/features/global/components/loading-component", () => {
  return function MockLoadingComponent() {
    return <div data-testid="loading-component">Loading...</div>;
  };
});

describe("ProfilePage Details", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-user-id";

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Profile Details");
  });

  it("calls requireAuth and prefetches user data", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);

    const result = await ProfilePage({
      params: Promise.resolve({id: mockId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(prefetchUser).toHaveBeenCalledWith(mockId);
    expect(screen.getByTestId("profile-details")).toHaveTextContent(mockId);
  });
});
