import {render, screen} from "@testing-library/react";

import {requireSubscription} from "@/features/auth/helpers/auth-utils";
import CreateRelease, {
  metadata,
} from "@/app/project/details/[id]/release/create/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/releases/components/create-release-form", () => {
  return function MockCreateReleaseForm({projectId}: {projectId: string}) {
    return (
      <div data-testid="create-release-form">
        Create Release Form {projectId}
      </div>
    );
  };
});

describe("CreateRelease Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-project-id";

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Create Release");
  });

  it("calls requireSubscription and renders CreateReleaseForm", async () => {
    (requireSubscription as jest.Mock).mockResolvedValue(undefined);

    const result = await CreateRelease({
      params: Promise.resolve({id: mockId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireSubscription).toHaveBeenCalled();
    expect(screen.getByTestId("create-release-form")).toHaveTextContent(mockId);
  });
});
