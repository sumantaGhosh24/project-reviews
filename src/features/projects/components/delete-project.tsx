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

interface DeleteProjectProps {
  id: string;
}

const DeleteProject = ({id}: DeleteProjectProps) => {
  const handleDelete = async () => {
    // TODO:
    console.log(id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="text-white">
          <TrashIcon size={24} /> Delete Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you really want to delete this Project?
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={handleDelete}
          variant="destructive"
          className="text-white"
          //   disabled={deleteProject.isPending}
        >
          <LoadingSwap
            isLoading={false}
            //   isLoading={deleteProject.isPending}
          >
            <span className="flex items-center gap-2">
              <TrashIcon size={24} /> Delete Project
            </span>
          </LoadingSwap>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProject;
