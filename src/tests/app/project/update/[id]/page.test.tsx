import {render, screen} from "@testing-library/react";

import {requireSubscription} from "@/features/auth/helpers/auth-utils";
import {prefetchProject} from "@/features/projects/server/prefetch";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import UpdateProject, {metadata} from "@/app/project/update/[id]/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/projects/server/prefetch");
jest.mock("@/features/categories/server/prefetch");
jest.mock("@/features/projects/components/update-project-component", () => {
  return function MockUpdateProjectComponent({id}: {id: string}) {
    return (
      <div data-testid="update-project-component">
        Update Project Component {id}
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

describe("UpdateProject Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-project-id";

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Update Project");
  });

  it("calls requireSubscription and prefetches project data", async () => {
    (requireSubscription as jest.Mock).mockResolvedValue(undefined);

    const result = await UpdateProject({
      params: Promise.resolve({id: mockId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireSubscription).toHaveBeenCalled();
    expect(prefetchProject).toHaveBeenCalledWith(mockId);
    expect(prefetchAllCategory).toHaveBeenCalled();
    expect(screen.getByTestId("update-project-component")).toHaveTextContent(
      mockId
    );
  });
});
