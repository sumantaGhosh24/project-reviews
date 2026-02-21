import {createElement} from "react";
import {renderHook} from "@testing-library/react";
import {
  useSuspenseQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {toast} from "sonner";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {
  useSuspenseProject,
  useSuspenseAllProjects,
  useSuspensePublicProjects,
  useSuspenseMyProjects,
  useSuspenseUserProjects,
  useSuspenseViewProject,
  useCreateProject,
  useUpdateProject,
  useRemoveProject,
  useAddProjectImage,
  useRemoveProjectImage,
} from "@/features/projects/hooks/use-projects";

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

describe("useProjects hooks", () => {
  const mockTRPC = {
    project: {
      getOne: {queryOptions: jest.fn()},
      getAll: {queryOptions: jest.fn()},
      getMyAll: {queryOptions: jest.fn()},
      getPublic: {queryOptions: jest.fn()},
      getUserAll: {queryOptions: jest.fn()},
      view: {queryOptions: jest.fn()},
      create: {mutationOptions: jest.fn()},
      update: {mutationOptions: jest.fn()},
      remove: {mutationOptions: jest.fn()},
      addImage: {mutationOptions: jest.fn()},
      removeImage: {mutationOptions: jest.fn()},
    },
  };

  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  };

  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  let queryClient: QueryClient;

  const wrapper = ({children}: {children: React.ReactNode}) =>
    createElement(QueryClientProvider, {client: queryClient}, children);

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
    (useTRPC as jest.Mock).mockReturnValue(mockTRPC);
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    (useGlobalParams as jest.Mock).mockReturnValue([{page: 1, pageSize: 10}]);
  });

  it("useSuspenseProject calls getOne.queryOptions", () => {
    mockTRPC.project.getOne.queryOptions.mockReturnValue({
      queryKey: ["project"],
    });
    renderHook(() => useSuspenseProject("p1"), {wrapper});
    expect(mockTRPC.project.getOne.queryOptions).toHaveBeenCalledWith({
      id: "p1",
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["project"]});
  });

  it("useSuspenseAllProjects calls getAll.queryOptions with params", () => {
    mockTRPC.project.getAll.queryOptions.mockReturnValue({
      queryKey: ["projects"],
    });
    renderHook(() => useSuspenseAllProjects(), {wrapper});
    expect(mockTRPC.project.getAll.queryOptions).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["projects"]});
  });

  it("useSuspensePublicProjects calls getPublic.queryOptions with params", () => {
    mockTRPC.project.getPublic.queryOptions.mockReturnValue({
      queryKey: ["projects-public"],
    });
    renderHook(() => useSuspensePublicProjects(), {wrapper});
    expect(mockTRPC.project.getPublic.queryOptions).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({
      queryKey: ["projects-public"],
    });
  });

  it("useSuspenseMyProjects calls getMyAll.queryOptions with params", () => {
    mockTRPC.project.getMyAll.queryOptions.mockReturnValue({
      queryKey: ["projects-my"],
    });
    renderHook(() => useSuspenseMyProjects(), {wrapper});
    expect(mockTRPC.project.getMyAll.queryOptions).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({
      queryKey: ["projects-my"],
    });
  });

  it("useSuspenseUserProjects calls getUserAll.queryOptions with userId and params", () => {
    mockTRPC.project.getUserAll.queryOptions.mockReturnValue({
      queryKey: ["projects-user"],
    });
    renderHook(() => useSuspenseUserProjects("u1"), {wrapper});
    expect(mockTRPC.project.getUserAll.queryOptions).toHaveBeenCalledWith({
      userId: "u1",
      page: 1,
      pageSize: 10,
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({
      queryKey: ["projects-user"],
    });
  });

  it("useSuspenseViewProject calls view.queryOptions with id", () => {
    mockTRPC.project.view.queryOptions.mockReturnValue({
      queryKey: ["project-view"],
    });
    renderHook(() => useSuspenseViewProject("p1"), {wrapper});
    expect(mockTRPC.project.view.queryOptions).toHaveBeenCalledWith({
      id: "p1",
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({
      queryKey: ["project-view"],
    });
  });

  it("useCreateProject calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useCreateProject(), {wrapper});
    const options = mockTRPC.project.create.mutationOptions.mock.calls[0][0];

    options.onSuccess();
    expect(toast.success).toHaveBeenCalledWith("Project created successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useUpdateProject calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useUpdateProject(), {wrapper});
    const options = mockTRPC.project.update.mutationOptions.mock.calls[0][0];

    options.onSuccess({id: "p1"});
    expect(toast.success).toHaveBeenCalledWith("Project updated successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(
      expect.objectContaining({queryKey: expect.any(Array)})
    );
  });

  it("useRemoveProject calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useRemoveProject(), {wrapper});
    const options = mockTRPC.project.remove.mutationOptions.mock.calls[0][0];

    options.onSuccess();
    expect(toast.success).toHaveBeenCalledWith("Project removed successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useAddProjectImage calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useAddProjectImage(), {wrapper});
    const options = mockTRPC.project.addImage.mutationOptions.mock.calls[0][0];

    options.onSuccess({id: "p1"});
    expect(toast.success).toHaveBeenCalledWith(
      "Project image added successfully"
    );
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useRemoveProjectImage calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useRemoveProjectImage(), {wrapper});
    const options =
      mockTRPC.project.removeImage.mutationOptions.mock.calls[0][0];

    options.onSuccess({id: "p1"});
    expect(toast.success).toHaveBeenCalledWith(
      "Project image removed successfully"
    );
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useCreateProject calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useCreateProject(), {wrapper});
    const options = mockTRPC.project.create.mutationOptions.mock.calls[0][0];

    options.onError({message: "Create failed"});
    expect(toast.error).toHaveBeenCalledWith("Create failed");
  });

  it("useUpdateProject calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useUpdateProject(), {wrapper});
    const options = mockTRPC.project.update.mutationOptions.mock.calls[0][0];

    options.onError({message: "Update failed"});
    expect(toast.error).toHaveBeenCalledWith("Update failed");
  });

  it("useRemoveProject calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useRemoveProject(), {wrapper});
    const options = mockTRPC.project.remove.mutationOptions.mock.calls[0][0];

    options.onError({message: "Remove failed"});
    expect(toast.error).toHaveBeenCalledWith("Remove failed");
  });

  it("useAddProjectImage calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useAddProjectImage(), {wrapper});
    const options = mockTRPC.project.addImage.mutationOptions.mock.calls[0][0];

    options.onError({message: "Add image failed"});
    expect(toast.error).toHaveBeenCalledWith("Add image failed");
  });

  it("useRemoveProjectImage calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useRemoveProjectImage(), {wrapper});
    const options =
      mockTRPC.project.removeImage.mutationOptions.mock.calls[0][0];

    options.onError({message: "Remove image failed"});
    expect(toast.error).toHaveBeenCalledWith("Remove image failed");
  });
});
