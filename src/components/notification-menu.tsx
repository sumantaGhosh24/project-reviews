"use client";

import Link from "next/link";

import {useNotificationCount} from "@/features/notifications/hooks/use-notifications";

import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import {Skeleton} from "./ui/skeleton";

const NotificationMenu = () => {
  const {data: notificationCount, isPending: isNotificationLoading} =
    useNotificationCount();

  if (isNotificationLoading) return <Skeleton className="w-10 h-8" />;

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
        <Link
          href="/notifications"
          className="flex items-center justify-between flex-row gap-2"
        >
          <span>Notifications</span>
          {notificationCount
            ? notificationCount > 0 && (
                <span className="relative flex size-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex size-4 rounded-full bg-primary/80"></span>
                </span>
              )
            : ""}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export default NotificationMenu;
