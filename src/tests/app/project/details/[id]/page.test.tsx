import {render, screen} from "@testing-library/react";

import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {prefetchViewProject} from "@/features/projects/server/prefetch";
import {prefetchReleases} from "@/features/releases/server/prefetch";
import ProjectDetailsPage, {metadata} from "@/app/project/details/[id]/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/projects/server/prefetch");
jest.mock("@/features/releases/server/prefetch");
jest.mock("@/features/projects/components/project-details", () => {
  return function MockProjectDetails({id}: {id: string}) {
    return <div data-testid="project-details">Project Details {id}</div>;
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

describe("ProjectDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockId = "test-project-id";

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Project Details");
  });

  it("calls requireAuth and prefetches project and releases data", async () => {
    (requireAuth as jest.Mock).mockResolvedValue(undefined);

    const result = await ProjectDetailsPage({
      params: Promise.resolve({id: mockId}),
      searchParams: Promise.resolve({}),
    });
    render(result);

    expect(requireAuth).toHaveBeenCalled();
    expect(prefetchViewProject).toHaveBeenCalledWith(mockId);
    expect(prefetchReleases).toHaveBeenCalledWith({projectId: mockId});
    expect(screen.getByTestId("project-details")).toHaveTextContent(mockId);
  });
});
