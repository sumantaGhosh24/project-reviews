import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchRelease} from "@/features/releases/server/prefetch";
import {prefetchReviews} from "@/features/reviews/server/prefetch";
import {prefetchComments} from "@/features/comments/server/prefetch";
import {globalParamsLoader} from "@/features/global/server/params-loader";
import ReleaseDetailsPage, {
  metadata,
} from "@/app/project/details/[id]/release/[releaseId]/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/releases/server/prefetch");
jest.mock("@/features/reviews/server/prefetch");
jest.mock("@/features/comments/server/prefetch");
jest.mock("@/features/global/server/params-loader", () => ({
  globalParamsLoader: jest.fn(),
}));
jest.mock("@/features/releases/components/release-details", () => {
  return function MockReleaseDetails({id}: {id: string}) {
    return <div data-testid="release-details">Release Details {id}</div>;
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

describe("ReleaseDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-project-id";
  const mockReleaseId = "test-release-id";
  const mockParams = {page: 1, limit: 10};

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Release Details");
  });

  it("calls requireAuth and prefetches release, reviews and comments data", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);
    (globalParamsLoader as jest.Mock).mockResolvedValue(mockParams);

    const result = await ReleaseDetailsPage({
      params: Promise.resolve({id: mockId, releaseId: mockReleaseId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(globalParamsLoader).toHaveBeenCalled();
    expect(prefetchRelease).toHaveBeenCalledWith(mockReleaseId);
    expect(prefetchReviews).toHaveBeenCalledWith({
      ...mockParams,
      releaseId: mockReleaseId,
    });
    expect(prefetchComments).toHaveBeenCalledWith({
      ...mockParams,
      releaseId: mockReleaseId,
    });
    expect(screen.getByTestId("release-details")).toHaveTextContent(
      mockReleaseId
    );
  });
});
