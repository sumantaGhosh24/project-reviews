"use client";

import {User} from "@/generated/prisma/client";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import PaginationComponent from "@/features/global/components/pagination-component";
import EmptyComponent from "@/features/global/components/empty-component";

import {useSuspenseFollowings} from "../hooks/use-profile";
import UserCard from "./user-card";

interface ProfileFollowingsTableProps {
  id: string;
}

interface UserCardProps extends User {
  isFollowing: boolean;
  isActiveUser: boolean;
}

const ProfileFollowingsTable = ({id}: ProfileFollowingsTableProps) => {
  const {data: followings, isFetching} = useSuspenseFollowings(id);

  const [params, setParams] = useGlobalParams();

  return (
    <>
      {followings.items.length > 0 ? (
        <>
          {followings.items.map((user) => (
            <UserCard key={user.id} user={user as UserCardProps} />
          ))}
          {followings.totalPages > 1 && (
            <PaginationComponent
              page={followings?.page}
              totalPages={followings.totalPages}
              onPageChange={(page) => setParams({...params, page})}
              disabled={isFetching}
            />
          )}
        </>
      ) : (
        <EmptyComponent
          title="No Followings Found"
          description="Try again later"
          buttonText="Go Home"
          redirectUrl="/home"
        />
      )}
    </>
  );
};

export default ProfileFollowingsTable;
