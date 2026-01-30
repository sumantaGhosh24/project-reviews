import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";

export const useSuspenseCategories = () => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

  return useSuspenseQuery(trpc.category.getAllPaginated.queryOptions(params));
};

export const useSuspenseAllCategories = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.category.getAll.queryOptions());
};

export const useSuspenseCategory = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.category.getOne.queryOptions({id}));
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.category.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Category created successfully " + data.id);

        queryClient.invalidateQueries(
          trpc.category.getAllPaginated.queryOptions({})
        );
        queryClient.invalidateQueries(trpc.category.getAll.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.category.update.mutationOptions({
      onSuccess: (data) => {
        toast.success("Category updated successfully");

        queryClient.invalidateQueries(
          trpc.category.getOne.queryOptions({id: data.id})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

export const useRemoveCategory = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.category.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Category removed successfully");

        queryClient.invalidateQueries(
          trpc.category.getAllPaginated.queryOptions({})
        );
        queryClient.invalidateQueries(trpc.category.getAll.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};
