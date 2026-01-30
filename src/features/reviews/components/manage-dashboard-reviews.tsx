"use client";

import ComponentWrapper from "@/features/global/components/component-wrapper";

import DashboardReviewsTable from "./dashboard-reviews-table";

const ManageDashboardReviews = () => {
  return (
    <ComponentWrapper
      title="Manage My Reviews"
      description="Manage my reviews."
      table={<DashboardReviewsTable />}
      className="my-0 shadow-none p-0"
    />
  );
};

export default ManageDashboardReviews;
