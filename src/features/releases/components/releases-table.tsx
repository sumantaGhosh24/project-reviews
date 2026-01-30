"use client";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import PaginationComponent from "@/features/global/components/pagination-component";
import EmptyComponent from "@/features/global/components/empty-component";

import {useSuspenseReleases} from "../hooks/use-releases";
import ReleaseCard from "./release-card";

interface ReleasesTableProps {
  projectId: string;
}

const ReleasesTable = ({projectId}: ReleasesTableProps) => {
  const {data: releases, isFetching} = useSuspenseReleases(projectId);

  const [params, setParams] = useGlobalParams();

  return (
    <>
      {releases.items.length > 0 ? (
        <div>
          {releases.items.map((release) => (
            <ReleaseCard key={release.id} {...release} />
          ))}
          {releases.totalPages > 1 && (
            <PaginationComponent
              page={releases?.page}
              totalPages={releases.totalPages}
              onPageChange={(page) => setParams({...params, page})}
              disabled={isFetching}
            />
          )}
        </div>
      ) : (
        <EmptyComponent
          title="No Release Found"
          description="Try again later"
          buttonText="Go Home"
          redirectUrl="/home"
        />
      )}
    </>
  );
};

export default ReleasesTable;
