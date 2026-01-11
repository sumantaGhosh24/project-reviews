"use client";

import {
  EmptyComponent,
  PaginationComponent,
} from "@/components/entity-components";
import {User} from "@/generated/prisma/client";

import {useSuspenseFollowings} from "../hooks/use-profile";
import {useProfileParams} from "../hooks/use-profile-params";
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

  const [params, setParams] = useProfileParams();

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
