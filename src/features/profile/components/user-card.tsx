"use client";

import {useRouter} from "next/navigation";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {User} from "@/generated/prisma/client";

import {useHandleFollow} from "../hooks/use-profile";

interface UserCardProps {
  user: User & {
    isFollowing: boolean;
    isActiveUser: boolean;
  };
}

const UserCard = ({user}: UserCardProps) => {
  const router = useRouter();

  const handleFollow = useHandleFollow();

  const handleView = () => {
    router.push(`/profile/${user.id}/details`);
  };

  const toggleFollow = () => {
    handleFollow.mutate({
      userId: user.id,
    });
  };

  return (
    <Card className="p-0 py-2">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage
              src={user?.image ?? "https://placehold.co/600x400.png"}
            />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-base">{user.name}</CardTitle>
          <CardDescription className="hidden md:block">
            {user.email}
          </CardDescription>
        </div>
        <div>
          {!user?.isActiveUser &&
            (user.isFollowing ? (
              <Button variant="destructive" onClick={toggleFollow}>
                Unfollow
              </Button>
            ) : (
              <Button variant="default" onClick={toggleFollow}>
                Follow
              </Button>
            ))}
          <Button variant="success" onClick={handleView} className="ml-2">
            View
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
