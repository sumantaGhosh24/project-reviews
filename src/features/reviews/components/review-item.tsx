"use client";

import Link from "next/link";
import {formatDistanceToNow} from "date-fns";
import {StarIcon} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Card, CardContent} from "@/components/ui/card";
import {Review} from "@/generated/prisma/client";

import {ReviewActions} from "./review-actions";

interface ReviewItemProps {
  review: Review & {
    author: {
      id: string;
      name: string;
      image: string | null;
    };
    isOwner: boolean;
  };
}

export function ReviewItem({review}: ReviewItemProps) {
  return (
    <Card className={`mb-3 py-2 ${review.isOwner ? "border-primary" : ""}`}>
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <Avatar>
            <AvatarImage
              src={review.author.image ?? "https://placehold.co/600x400.png"}
            />
            <AvatarFallback>
              {review.author.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Link href={`/profile/details/${review.author.id}`}>
              <span className="font-medium capitalize hover:text-primary">
                {review.author.name}
              </span>
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {Array.from({length: review.rating}).map((_, ind) => (
              <StarIcon key={ind} className="text-orange-500 fill-orange-500" />
            ))}
            {Array.from({length: 5 - review.rating}).map((_, ind) => (
              <StarIcon key={ind} className="text-muted-foreground" />
            ))}
          </div>
          <p>{review.feedback}</p>
          {review.isOwner && <ReviewActions reviewId={review.id} />}
        </div>
      </CardContent>
    </Card>
  );
}
