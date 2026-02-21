/* eslint-disable @typescript-eslint/no-explicit-any */
import {prefetch, trpc} from "@/trpc/server";
import {
  prefetchProject,
  prefetchAllProjects,
  prefetchPublicProjects,
  prefetchMyProjects,
  prefetchUserProjects,
  prefetchViewProject,
} from "@/features/projects/server/prefetch";

jest.mock("@/trpc/server", () => {
  const prefetch = jest.fn();
  const trpc = {
    project: {
      getOne: {queryOptions: jest.fn()},
      getAll: {queryOptions: jest.fn()},
      getPublic: {queryOptions: jest.fn()},
      getMyAll: {queryOptions: jest.fn()},
      getUserAll: {queryOptions: jest.fn()},
      view: {queryOptions: jest.fn()},
    },
  };

  return {prefetch, trpc};
});

describe("projects prefetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prefetches single project", async () => {
    const id = "p1";
    const options = {queryKey: ["project"], queryFn: jest.fn()};
    (trpc.project.getOne.queryOptions as jest.Mock).mockReturnValue(options);

    await prefetchProject(id);

    expect(trpc.project.getOne.queryOptions).toHaveBeenCalledWith({id});
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches all projects", async () => {
    const params = {page: 1, pageSize: 10};
    const options = {queryKey: ["projects"], queryFn: jest.fn()};
    (trpc.project.getAll.queryOptions as jest.Mock).mockReturnValue(options);

    await prefetchAllProjects(params as any);

    expect(trpc.project.getAll.queryOptions).toHaveBeenCalledWith(params);
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches public projects", async () => {
    const params = {page: 1, pageSize: 10};
    const options = {queryKey: ["public-projects"], queryFn: jest.fn()};
    (trpc.project.getPublic.queryOptions as jest.Mock).mockReturnValue(options);

    await prefetchPublicProjects(params as any);

    expect(trpc.project.getPublic.queryOptions).toHaveBeenCalledWith(params);
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches my projects", async () => {
    const params = {page: 1, pageSize: 10};
    const options = {queryKey: ["my-projects"], queryFn: jest.fn()};
    (trpc.project.getMyAll.queryOptions as jest.Mock).mockReturnValue(options);

    await prefetchMyProjects(params as any);

    expect(trpc.project.getMyAll.queryOptions).toHaveBeenCalledWith(params);
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches user projects", async () => {
    const params = {page: 1, pageSize: 10, userId: "u1"};
    const options = {queryKey: ["user-projects"], queryFn: jest.fn()};
    (trpc.project.getUserAll.queryOptions as jest.Mock).mockReturnValue(
      options
    );

    await prefetchUserProjects(params as any);

    expect(trpc.project.getUserAll.queryOptions).toHaveBeenCalledWith(params);
    expect(prefetch).toHaveBeenCalledWith(options);
  });

  it("prefetches project view", async () => {
    const id = "p1";
    const options = {queryKey: ["project-view"], queryFn: jest.fn()};
    (trpc.project.view.queryOptions as jest.Mock).mockReturnValue(options);

    await prefetchViewProject(id);

    expect(trpc.project.view.queryOptions).toHaveBeenCalledWith({id});
    expect(prefetch).toHaveBeenCalledWith(options);
  });
});
