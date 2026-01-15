"use client";

import {
  EmptyComponent,
  PaginationComponent,
} from "@/components/entity-components";

import {useSuspenseReleases} from "../hooks/use-releases";
import {useReleasesParams} from "../hooks/use-releases-params";
import ReleaseCard from "./release-card";

interface ReleasesTableProps {
  projectId: string;
}

const ReleasesTable = ({projectId}: ReleasesTableProps) => {
  const {data: releases, isFetching} = useSuspenseReleases(projectId);

  const [params, setParams] = useReleasesParams();

  return (
    <>
      {releases.items.length > 0 ? (
        <div className="">
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
