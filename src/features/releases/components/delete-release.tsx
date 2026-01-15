"use client";

import {useRouter} from "next/navigation";
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

import {useRemoveRelease} from "../hooks/use-releases";

interface DeleteReleaseProps {
  id: string;
}

const DeleteRelease = ({id}: DeleteReleaseProps) => {
  const router = useRouter();

  const deleteRelease = useRemoveRelease();

  const handleDelete = async () => {
    deleteRelease.mutate(
      {
        id,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(buttonVariants({variant: "destructive"}))}
      >
        <TrashIcon size={24} /> Delete Release
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete this release?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete release
            and remove release data from our servers.
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
            disabled={deleteRelease.isPending}
          >
            <LoadingSwap isLoading={deleteRelease.isPending}>
              <span className="flex items-center gap-2">
                <TrashIcon size={24} /> Delete Release
              </span>
            </LoadingSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRelease;
