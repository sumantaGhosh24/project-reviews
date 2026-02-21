import {render, screen} from "@testing-library/react";

import {requireSubscription} from "@/features/auth/helpers/auth-utils";
import {prefetchRelease} from "@/features/releases/server/prefetch";
import UpdateRelease, {
  metadata,
} from "@/app/project/details/[id]/release/[releaseId]/update/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/releases/server/prefetch");
jest.mock("@/features/releases/components/update-release-component", () => {
  return function MockUpdateReleaseComponent({
    id,
    releaseId,
  }: {
    id: string;
    releaseId: string;
  }) {
    return (
      <div data-testid="update-release-component">
        Update Release Component {id} {releaseId}
      </div>
    );
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

describe("UpdateRelease Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-project-id";
  const mockReleaseId = "test-release-id";

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Update Release");
  });

  it("calls requireSubscription and prefetches release data", async () => {
    (requireSubscription as jest.Mock).mockResolvedValue(undefined);

    const result = await UpdateRelease({
      params: Promise.resolve({id: mockId, releaseId: mockReleaseId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireSubscription).toHaveBeenCalled();
    expect(prefetchRelease).toHaveBeenCalledWith(mockReleaseId);
    expect(screen.getByTestId("update-release-component")).toHaveTextContent(
      mockId
    );
    expect(screen.getByTestId("update-release-component")).toHaveTextContent(
      mockReleaseId
    );
  });
});
