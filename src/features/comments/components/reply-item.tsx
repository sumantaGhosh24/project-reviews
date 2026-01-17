"use client";

import Link from "next/link";
import {formatDistanceToNow} from "date-fns";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Card, CardContent} from "@/components/ui/card";
import {Comment} from "@/generated/prisma/client";

interface ReplyItemProps {
  reply: Comment & {
    author: {
      id: string;
      name: string;
      image: string | null;
    };
  };
}

export function ReplyItem({reply}: ReplyItemProps) {
  return (
    <Card className="mb-3 py-2">
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <Avatar>
            <AvatarImage
              src={reply.author.image ?? "https://placehold.co/600x400.png"}
            />
            <AvatarFallback>{reply.author.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Link href={`/profile/details/${reply.author.id}`}>
              <span className="font-medium capitalize hover:text-primary">
                {reply.author.name}
              </span>
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(reply.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <p
            className={`text-sm ${
              reply.deletedAt ? "italic text-muted-foreground" : ""
            }`}
          >
            {reply.body}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
