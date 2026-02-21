import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchFollowings} from "@/features/profile/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import ProfileFollowingsPage from "@/app/profile/[id]/details/@followings/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/profile/server/prefetch");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/profile/components/profile-followings", () => {
  return function MockProfileFollowings({id}: {id: string}) {
    return <div data-testid="profile-followings">Profile Followings {id}</div>;
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

describe("ProfileFollowingsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-user-id";
  const mockParams = {page: 1, limit: 10};

  it("calls requireAuth, globalParamsLoader and prefetches followings", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await ProfileFollowingsPage({
      params: Promise.resolve({id: mockId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalled();
    expect(prefetchFollowings).toHaveBeenCalledWith({
      id: mockId,
      ...mockParams,
    });
    expect(screen.getByTestId("profile-followings")).toHaveTextContent(mockId);
  });
});
