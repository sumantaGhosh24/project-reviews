"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";

type Person = {
  id: string;
  name: string;
  avatarUrl: string;
};

const ProfileFollowings = () => {
  const following: Person[] = [
    {
      id: "f1",
      name: "Brandon Lee",
      avatarUrl: "https://placehold.co/600x400.png",
    },
    {
      id: "f2",
      name: "Samira Khan",
      avatarUrl: "https://placehold.co/600x400.png",
    },
    {
      id: "f3",
      name: "Diego Pérez",
      avatarUrl: "https://placehold.co/600x400.png",
    },
    {id: "f4", name: "Chen Wei", avatarUrl: "https://placehold.co/600x400.png"},
    {
      id: "f5",
      name: "Ava Smith",
      avatarUrl: "https://placehold.co/600x400.png",
    },
  ];

  // TODO:
  const toggleFollow = () => {};

  return (
    <div className="space-y-3">
      {following.map((person) => (
        <Card key={person.id}>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage src={person.avatarUrl} />
                <AvatarFallback>{person.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-base">{person.name}</CardTitle>
            </div>
            <Button variant="destructive" onClick={toggleFollow}>
              Unfollow
            </Button>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default ProfileFollowings;
