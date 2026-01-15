"use client";

import {TrashIcon} from "lucide-react";

import {cn} from "@/lib/utils";
import {LoadingSwap} from "@/components/loading-swap";
import {buttonVariants} from "@/components/ui/button";
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

import {useRemoveProject} from "../hooks/use-projects";

interface DeleteProjectProps {
  id: string;
}

const DeleteProject = ({id}: DeleteProjectProps) => {
  const deleteProject = useRemoveProject();

  const handleDelete = async () => {
    deleteProject.mutate({
      id,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(buttonVariants({variant: "destructive"}))}
      >
        <TrashIcon size={24} /> Delete Project
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete this project?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete project
            and remove project data from our servers.
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
            disabled={deleteProject.isPending}
          >
            <LoadingSwap isLoading={deleteProject.isPending}>
              <span className="flex items-center gap-2">
                <TrashIcon size={24} /> Delete Project
              </span>
            </LoadingSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProject;
