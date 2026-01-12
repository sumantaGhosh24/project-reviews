"use client";

import {useRouter} from "next/navigation";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";

import {useHandleFollow, useSuspenseUser} from "../hooks/use-profile";

interface ProfileDetailsProps {
  id: string;
}

const ProfileDetails = ({id}: ProfileDetailsProps) => {
  const {data, isFetching} = useSuspenseUser(id);

  const router = useRouter();

  const handleFollow = useHandleFollow();

  const handleUpdate = () => {
    router.push("/profile/edit");
  };

  const toggleFollow = () => {
    if (isFetching) return null;

    handleFollow.mutate({
      userId: id,
    });
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Avatar className="size-32">
        <AvatarImage src={data?.image ?? "https://placehold.co/600x400.png"} />
        <AvatarFallback>{data?.name?.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-semibold tracking-tight">
          {data?.name}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-white">
          {data?.email}
        </p>
        <div className="mt-4 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-white">
              {data?.projectsCount}
            </span>
            <span className="text-zinc-600 dark:text-white">Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-white">
              {data?.followersCount}
            </span>
            <span className="text-zinc-600 dark:text-white">Followers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-white">
              {data?.followingsCount}
            </span>
            <span className="text-zinc-600 dark:text-white">Following</span>
          </div>
        </div>
      </div>
      <div className="ml-auto">
        {data?.isActiveUser ? (
          <Button variant="success" onClick={handleUpdate}>
            Edit profile
          </Button>
        ) : data?.isFollowing ? (
          <Button variant="destructive" onClick={toggleFollow}>
            Unfollow
          </Button>
        ) : (
          <Button variant="default" onClick={toggleFollow}>
            Follow
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
