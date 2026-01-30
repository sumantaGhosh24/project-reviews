"use client";

import Link from "next/link";

import SearchBarComponent from "@/features/global/components/search-bar-component";
import {Button} from "@/components/ui/button";

import ReleasesTable from "./releases-table";

interface ManageReleasesProps {
  isOwner: boolean;
  projectId: string;
}

const ManageReleases = ({isOwner, projectId}: ManageReleasesProps) => {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">All Releases</h2>
        {isOwner && (
          <Button asChild>
            <Link href={`/project/details/${projectId}/release/create`}>
              Create Release
            </Link>
          </Button>
        )}
      </div>
      <div className="mb-8">
        <SearchBarComponent placeholder="Search releases" />
      </div>
      <ReleasesTable projectId={projectId} />
    </div>
  );
};

export default ManageReleases;
