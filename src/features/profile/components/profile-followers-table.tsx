"use client";

import {
  EmptyComponent,
  PaginationComponent,
} from "@/components/entity-components";
import {User} from "@/generated/prisma/client";

import {useSuspenseFollowers} from "../hooks/use-profile";
import {useProfileParams} from "../hooks/use-profile-params";
import UserCard from "./user-card";

interface ProfileFollowersTableProps {
  id: string;
}

interface UserCardProps extends User {
  isFollowing: boolean;
  isActiveUser: boolean;
}

const ProfileFollowersTable = ({id}: ProfileFollowersTableProps) => {
  const {data: followers, isFetching} = useSuspenseFollowers(id);

  const [params, setParams] = useProfileParams();

  return (
    <>
      {followers.items.length > 0 ? (
        <>
          {followers.items.map((user) => (
            <UserCard key={user.id} user={user as UserCardProps} />
          ))}
          {followers.totalPages > 1 && (
            <PaginationComponent
              page={followers?.page}
              totalPages={followers.totalPages}
              onPageChange={(page) => setParams({...params, page})}
              disabled={isFetching}
            />
          )}
        </>
      ) : (
        <EmptyComponent
          title="No Followers Found"
          description="Try again later"
          buttonText="Go Home"
          redirectUrl="/home"
        />
      )}
    </>
  );
};

export default ProfileFollowersTable;
