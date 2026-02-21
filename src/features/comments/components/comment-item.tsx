"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {formatDistanceToNow} from "date-fns";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Card, CardContent} from "@/components/ui/card";
import {Comment} from "@/generated/prisma/client";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {cn} from "@/lib/utils";

import {CommentActions} from "./comment-actions";
import {ReplyForm} from "./reply-form";
import {ReplyItem} from "./reply-item";

interface CommentItemProps {
  comment: Comment & {
    author: {
      id: string;
      name: string;
      image: string | null;
    };
    isOwner: boolean;
    votes: {
      type: string;
      _count: number;
    }[];
    myVote: {
      type: string;
    } | null;
    replies: {
      id: string;
      body: string;
      authorId: string;
      releaseId: string;
      parentId: string | null;
      deletedAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
      image: string | null;
      author: {
        id: string;
        name: string;
        image: string | null;
      };
    }[];
  };
}

export function CommentItem({comment}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);

  return (
    <Card
      className={cn("mb-3 py-2", comment.isOwner && "border-primary")}
    >
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <Avatar>
            <AvatarImage
              src={comment.author.image ?? "https://placehold.co/600x400.png"}
            />
            <AvatarFallback>
              {comment.author.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Link href={`/profile/details/${comment.author.id}`}>
              <span className="font-medium capitalize hover:text-primary">
                {comment.author.name}
              </span>
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <p
            className={`text-sm ${
              comment.deletedAt ? "italic text-muted-foreground" : ""
            }`}
          >
            {comment.body}
          </p>
          {comment.image && (
            <AspectRatio ratio={16 / 7}>
              <Image
                src={comment.image}
                alt="Image"
                className="w-full rounded-lg object-cover"
                fill
              />
            </AspectRatio>
          )}
          {!comment.deletedAt && (
            <CommentActions
              commentId={comment.id}
              releaseId={comment.releaseId}
              isOwner={comment.isOwner}
              votes={comment.votes}
              myVote={comment.myVote}
              onReply={() => setShowReply(!showReply)}
              replyCount={comment.replies.length}
            />
          )}
          {showReply && (
            <ReplyForm commentId={comment.id} releaseId={comment.releaseId} />
          )}
          {comment.replies.length > 0 && (
            <div className="mt-4 border-l pl-4">
              {comment.replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
