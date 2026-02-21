import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchFollowers} from "@/features/profile/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import ProfileFollowersPage from "@/app/profile/[id]/details/@followers/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/profile/server/prefetch");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/profile/components/profile-followers", () => {
  return function MockProfileFollowers({id}: {id: string}) {
    return <div data-testid="profile-followers">Profile Followers {id}</div>;
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

describe("ProfileFollowersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-user-id";
  const mockParams = {page: 1, limit: 10};

  it("calls requireAuth, globalParamsLoader and prefetches followers", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await ProfileFollowersPage({
      params: Promise.resolve({id: mockId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalled();
    expect(prefetchFollowers).toHaveBeenCalledWith({id: mockId, ...mockParams});
    expect(screen.getByTestId("profile-followers")).toHaveTextContent(mockId);
  });
});
