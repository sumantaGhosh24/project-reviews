import {createElement} from "react";
import {renderHook} from "@testing-library/react";
import {
  useSuspenseQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {
  useSuspenseRelease,
  useSuspenseReleases,
  useCreateRelease,
  useUpdateRelease,
  useRemoveRelease,
  useAddReleaseImage,
  useRemoveReleaseImage,
} from "@/features/releases/hooks/use-releases";

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));

describe("useReleases hooks", () => {
  const mockTRPC = {
    release: {
      getOne: {queryOptions: jest.fn()},
      getAll: {queryOptions: jest.fn()},
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

  it("useSuspenseRelease calls getOne.queryOptions", () => {
    mockTRPC.release.getOne.queryOptions.mockReturnValue({
      queryKey: ["release"],
    });
    renderHook(() => useSuspenseRelease("r1"), {wrapper});
    expect(mockTRPC.release.getOne.queryOptions).toHaveBeenCalledWith({
      id: "r1",
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["release"]});
  });

  it("useSuspenseReleases calls getAll.queryOptions with params", () => {
    mockTRPC.release.getAll.queryOptions.mockReturnValue({
      queryKey: ["releases"],
    });
    renderHook(() => useSuspenseReleases("p1"), {wrapper});
    expect(mockTRPC.release.getAll.queryOptions).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      projectId: "p1",
    });
    expect(useSuspenseQuery).toHaveBeenCalledWith({queryKey: ["releases"]});
  });

  it("useCreateRelease calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useCreateRelease(), {wrapper});
    const options = mockTRPC.release.create.mutationOptions.mock.calls[0][0];

    options.onSuccess({id: "r1"});
    expect(toast.success).toHaveBeenCalledWith("Release created successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useUpdateRelease calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useUpdateRelease(), {wrapper});
    const options = mockTRPC.release.update.mutationOptions.mock.calls[0][0];

    options.onSuccess({id: "r1"});
    expect(toast.success).toHaveBeenCalledWith("Release updated successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useRemoveRelease calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useRemoveRelease(), {wrapper});
    const options = mockTRPC.release.remove.mutationOptions.mock.calls[0][0];

    options.onSuccess({id: "r1"});
    expect(toast.success).toHaveBeenCalledWith("Release removed successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useAddReleaseImage calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useAddReleaseImage(), {wrapper});
    const options = mockTRPC.release.addImage.mutationOptions.mock.calls[0][0];

    options.onSuccess({id: "r1"});
    expect(toast.success).toHaveBeenCalledWith(
      "Release image added successfully"
    );
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useRemoveReleaseImage calls mutation and invalidates cache on success", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useRemoveReleaseImage(), {wrapper});
    const options =
      mockTRPC.release.removeImage.mutationOptions.mock.calls[0][0];

    options.onSuccess({id: "r1"});
    expect(toast.success).toHaveBeenCalledWith(
      "Release image removed successfully"
    );
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("useCreateRelease calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useCreateRelease(), {wrapper});
    const options = mockTRPC.release.create.mutationOptions.mock.calls[0][0];

    options.onError({message: "Create failed"});
    expect(toast.error).toHaveBeenCalledWith("Create failed");
  });

  it("useUpdateRelease calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useUpdateRelease(), {wrapper});
    const options = mockTRPC.release.update.mutationOptions.mock.calls[0][0];

    options.onError({message: "Update failed"});
    expect(toast.error).toHaveBeenCalledWith("Update failed");
  });

  it("useRemoveRelease calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useRemoveRelease(), {wrapper});
    const options = mockTRPC.release.remove.mutationOptions.mock.calls[0][0];

    options.onError({message: "Remove failed"});
    expect(toast.error).toHaveBeenCalledWith("Remove failed");
  });

  it("useAddReleaseImage calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useAddReleaseImage(), {wrapper});
    const options = mockTRPC.release.addImage.mutationOptions.mock.calls[0][0];

    options.onError({message: "Add image failed"});
    expect(toast.error).toHaveBeenCalledWith("Add image failed");
  });

  it("useRemoveReleaseImage calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useRemoveReleaseImage(), {wrapper});
    const options =
      mockTRPC.release.removeImage.mutationOptions.mock.calls[0][0];

    options.onError({message: "Remove image failed"});
    expect(toast.error).toHaveBeenCalledWith("Remove image failed");
  });
});
