"use client";

import SearchRelease from "./search-release";
import ReleasesTable from "./releases-table";
import CreateReleaseForm from "./create-release-form";

interface ManageReleasesProps {
  isOwner: boolean;
  projectId: string;
}

const ManageReleases = ({isOwner, projectId}: ManageReleasesProps) => {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">All Releases</h2>
        {isOwner && <CreateReleaseForm projectId={projectId} />}
      </div>
      <div className="mb-8">
        <SearchRelease />
      </div>
      <ReleasesTable projectId={projectId} />
    </div>
  );
};

export default ManageReleases;
