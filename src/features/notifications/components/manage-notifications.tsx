"use client";

import ComponentWrapper from "@/features/global/components/component-wrapper";

import MarkAllNotificationsRead from "./mark-all-notifications-read";
import NotificationsTable from "./notifications-table";

const ManageNotifications = () => {
  return (
    <ComponentWrapper
      title="Manage Notifications"
      description="Admin manage all notifications."
      button={<MarkAllNotificationsRead />}
      table={<NotificationsTable />}
    />
  );
};

export default ManageNotifications;
