"use client";

import {TrashIcon} from "lucide-react";

import {LoadingSwap} from "@/components/loading-swap";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteCategoryProps {
  id: string;
}

const DeleteCategory = ({id}: DeleteCategoryProps) => {
  const handleDelete = async () => {
    // TODO:
    console.log(id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="text-white">
          <TrashIcon size={24} /> Delete Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you really want to delete this category?
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={handleDelete}
          variant="destructive"
          className="text-white"
          //   disabled={deleteCategory.isPending}
        >
          <LoadingSwap
            isLoading={false}
            //   isLoading={deleteCategory.isPending}
          >
            <span className="flex items-center">
              <TrashIcon size={24} className="mr-2" /> Delete Category
            </span>
          </LoadingSwap>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategory;
