"use client";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import PaginationComponent from "@/features/global/components/pagination-component";
import EmptyComponent from "@/features/global/components/empty-component";
import {User} from "@/generated/prisma/client";

import {useSuspenseFollowers} from "../hooks/use-profile";
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

  const [params, setParams] = useGlobalParams();

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
