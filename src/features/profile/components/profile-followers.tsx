"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";

type Person = {
  id: string;
  name: string;
  avatarUrl: string;
};

const ProfileFollowers = () => {
  const followers: Person[] = [
    {
      id: "r1",
      name: "Maria Rossi",
      avatarUrl: "https://placehold.co/600x400.png",
    },
    {id: "r2", name: "Noah Kim", avatarUrl: "https://placehold.co/600x400.png"},
    {
      id: "r3",
      name: "Liam Johnson",
      avatarUrl: "https://placehold.co/600x400.png",
    },
    {
      id: "r4",
      name: "Olivia Brown",
      avatarUrl: "https://placehold.co/600x400.png",
    },
    {
      id: "r5",
      name: "Lucas Silva",
      avatarUrl: "https://placehold.co/600x400.png",
    },
  ];

  const isFollowing = false;

  // TODO:
  const toggleFollow = () => {};

  return (
    <div className="space-y-3">
      {followers.map((person) => (
        <Card key={person.id}>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage src={person.avatarUrl} />
                <AvatarFallback>{person.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-base">{person.name}</CardTitle>
            </div>
            {isFollowing ? (
              <Button variant="destructive" onClick={toggleFollow}>
                Unfollow
              </Button>
            ) : (
              <Button variant="default" onClick={toggleFollow}>
                Follow
              </Button>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default ProfileFollowers;
