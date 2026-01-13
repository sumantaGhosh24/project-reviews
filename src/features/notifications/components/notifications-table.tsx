"use client";

import {useRouter} from "next/navigation";
import {formatDistanceToNowStrict} from "date-fns";

import {cn} from "@/lib/utils";
import {
  EmptyComponent,
  PaginationComponent,
} from "@/components/entity-components";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useReadNotification,
  useSuspenseNotifications,
} from "../hooks/use-notifications";
import {useNotificationsParams} from "../hooks/use-notifications-params";

const NotificationsTable = () => {
  const router = useRouter();

  const {data: notifications, isFetching} = useSuspenseNotifications();

  const [params, setParams] = useNotificationsParams();

  const markNotificationRead = useReadNotification();

  const handleReadNotification = async (id: string) => {
    markNotificationRead.mutate({id});
  };

  const handleClick = async (id: string, url?: string) => {
    await handleReadNotification(id);

    if (url) router.push(url);
  };

  return (
    <>
      {notifications.items.length > 0 ? (
        <div>
          {notifications.items.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "flex flex-row items-center flex-1 py-2",
                notification.readAt === null && "bg-primary/20"
              )}
            >
              <CardHeader className="w-full">
                <CardTitle>{notification.title}</CardTitle>
                <CardDescription>
                  {formatDistanceToNowStrict(notification.createdAt, {
                    addSuffix: true,
                  })}
                </CardDescription>
                <CardContent className="p-0">{notification.body}</CardContent>
              </CardHeader>
              <CardFooter className="max-w-fit">
                <Button
                  onClick={() =>
                    handleClick(notification.id, notification!.url!)
                  }
                >
                  Visit
                </Button>
                {notification.readAt === null && (
                  <Button
                    onClick={() => handleReadNotification(notification.id)}
                    className="ml-2"
                  >
                    Mark Read
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
          {notifications.totalPages > 1 && (
            <PaginationComponent
              page={notifications?.page}
              totalPages={notifications.totalPages}
              onPageChange={(page) => setParams({...params, page})}
              disabled={isFetching}
            />
          )}
        </div>
      ) : (
        <EmptyComponent
          title="No Notifications Found"
          description="Try again later"
          buttonText="Go Home"
          redirectUrl="/home"
        />
      )}
    </>
  );
};

export default NotificationsTable;
