"use client";

import {useRouter} from "next/navigation";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";

type User = {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
};

const ProfileDetails = () => {
  const user: User = {
    id: "u1",
    name: "Alice Johnson",
    avatarUrl: "https://placehold.co/600x400.png",
    bio: "Frontend Engineer • Building delightful interfaces and accessible experiences.",
    postsCount: 12,
    followersCount: 248,
    followingCount: 180,
  };

  const activeUser = true;
  const isFollowing = false;

  const router = useRouter();

  const handleUpdate = () => {
    router.push("/profile/edit");
  };

  // TODO:
  const toggleFollow = () => {};

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Avatar className="size-32">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-semibold tracking-tight">
          {user.name}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-white">
          {user.bio}
        </p>
        <div className="mt-4 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-white">
              {user.postsCount}
            </span>
            <span className="text-zinc-600 dark:text-white">Posts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-white">
              {user.followersCount}
            </span>
            <span className="text-zinc-600 dark:text-white">Followers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-white">
              {user.followingCount}
            </span>
            <span className="text-zinc-600 dark:text-white">Following</span>
          </div>
        </div>
      </div>
      <div className="ml-auto">
        {activeUser ? (
          <Button variant="success" onClick={handleUpdate}>
            Edit profile
          </Button>
        ) : isFollowing ? (
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
