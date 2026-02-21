import {renderHook} from "@testing-library/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useVote} from "@/features/votes/hooks/use-votes";

describe("useVote", () => {
  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  };
  const mockTrpc = {
    vote: {
      create: {
        mutationOptions: jest.fn((options) => options),
      },
    },
    project: {
      getOne: {queryOptions: jest.fn()},
      view: {queryOptions: jest.fn()},
    },
    release: {getOne: {queryOptions: jest.fn()}},
    comment: {
      getOne: {queryOptions: jest.fn()},
      getAll: {queryOptions: jest.fn()},
    },
    review: {
      getOne: {queryOptions: jest.fn()},
      getAll: {queryOptions: jest.fn()},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    (useTRPC as jest.Mock).mockReturnValue(mockTrpc);
    (useMutation as jest.Mock).mockImplementation((options) => ({
      mutate: (variables: {target: string; targetId: string}) => {
        options.onSuccess({
          target: variables.target,
          targetId: variables.targetId,
        });
      },
    }));
  });

  it("handles project vote success", async () => {
    const {result} = renderHook(() => useVote());
    result.current.mutate({target: "PROJECT", targetId: "proj-1", type: "UP"});

    expect(toast.success).toHaveBeenCalledWith("Vote created successfully");
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(2);
  });

  it("handles release vote success", async () => {
    const {result} = renderHook(() => useVote());
    result.current.mutate({target: "RELEASE", targetId: "rel-1", type: "DOWN"});

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(1);
  });

  it("handles comment vote success", async () => {
    const {result} = renderHook(() => useVote("rel-1"));
    result.current.mutate({target: "COMMENT", targetId: "comm-1", type: "UP"});

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(2);
  });

  it("handles review vote success", async () => {
    const {result} = renderHook(() => useVote("rel-1"));
    result.current.mutate({target: "REVIEW", targetId: "rev-1", type: "DOWN"});

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(2);
  });

  it("calls toast.error on mutation error", () => {
    (useMutation as jest.Mock).mockReturnValue({mutate: jest.fn()});
    renderHook(() => useVote());
    const options = mockTrpc.vote.create.mutationOptions.mock.calls[0][0];

    options.onError({message: "Error message"});
    expect(toast.error).toHaveBeenCalledWith("Error message");
  });
});
