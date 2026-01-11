"use client";

import {TrashIcon} from "lucide-react";

import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {LoadingSwap} from "@/components/loading-swap";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {useRemoveCategory} from "../hooks/use-categories";

interface DeleteCategoryProps {
  id: string;
}

const DeleteCategory = ({id}: DeleteCategoryProps) => {
  const deleteCategory = useRemoveCategory();

  const handleDelete = async () => {
    deleteCategory.mutate({
      id,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(buttonVariants({variant: "destructive"}))}
      >
        <TrashIcon size={24} /> Delete Category
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete this category?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete category
            and remove category data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className={cn(buttonVariants({variant: "destructive"}))}
            disabled={deleteCategory.isPending}
          >
            <LoadingSwap isLoading={deleteCategory.isPending}>
              <span className="flex items-center gap-2">
                <TrashIcon size={24} /> Delete Category
              </span>
            </LoadingSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategory;
