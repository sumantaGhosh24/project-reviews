"use client";

import {ComponentWrapper} from "@/components/entity-components";

import DashboardCommentsTable from "./dashboard-comments-table";

const ManageDashboardComments = () => {
  return (
    <ComponentWrapper
      title="Manage My Comments"
      description="Manage my comments."
      table={<DashboardCommentsTable />}
      className="my-0 shadow-none p-0"
    />
  );
};

export default ManageDashboardComments;
