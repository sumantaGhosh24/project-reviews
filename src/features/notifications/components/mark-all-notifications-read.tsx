"use client";

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

import {useReadAllNotification} from "../hooks/use-notifications";

const MarkAllNotificationsRead = () => {
  const markAllNotificationRead = useReadAllNotification();

  const handleReadNotification = async () => {
    markAllNotificationRead.mutate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className={cn(buttonVariants({variant: "default"}))}>
        Mark All Notification Read
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to make all your notifications
            read?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently make all of your
            notifications read.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleReadNotification();
            }}
            className={cn(buttonVariants({variant: "destructive"}))}
            disabled={markAllNotificationRead.isPending}
          >
            <LoadingSwap isLoading={markAllNotificationRead.isPending}>
              Mark All Notification Read
            </LoadingSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MarkAllNotificationsRead;
