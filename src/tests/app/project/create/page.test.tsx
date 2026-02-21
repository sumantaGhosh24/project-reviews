import {render, screen} from "@testing-library/react";

import {requireSubscription} from "@/features/auth/helpers/auth-utils";
import {prefetchAllCategory} from "@/features/categories/server/prefetch";
import CreateProject, {metadata} from "@/app/project/create/page";

jest.mock("@/features/auth/helpers/auth-utils");
jest.mock("@/features/categories/server/prefetch");
jest.mock("@/features/projects/components/create-project-form", () => {
  return function MockCreateProjectForm() {
    return <div data-testid="create-project-form">Create Project Form</div>;
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

describe("CreateProject Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has the correct metadata title", () => {
    expect(metadata.title).toBe("Create Project");
  });

  it("calls requireSubscription and prefetches categories", async () => {
    (requireSubscription as jest.Mock).mockResolvedValue(undefined);

    const result = await CreateProject();
    render(result);

    expect(requireSubscription).toHaveBeenCalled();
    expect(prefetchAllCategory).toHaveBeenCalled();
    expect(screen.getByTestId("create-project-form")).toBeInTheDocument();
  });
});
