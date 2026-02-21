import Link from "next/link";
import {
  MessageSquareIcon,
  StarIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ViewIcon,
} from "lucide-react";

import {checkStatus, checkVisibility} from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {Image as ImageProps, Release} from "@/generated/prisma/client";

interface ReleaseCardProps extends Release {
  _count: {
    comments: number;
    reviews: number;
  };
  votes: {
    type: string;
    _count: number;
  }[];
  views: number;
  reviewStats: {
    _count: {
      id: number;
    };
    _avg: {
      rating: number | null;
    };
  };
  images: ImageProps[];
}

const MAX_IMAGE = 3;

const ReleaseCard = ({
  id,
  title,
  description,
  status,
  visibility,
  projectId,
  _count,
  votes,
  views,
  reviewStats,
  images,
}: ReleaseCardProps) => {
  const upVote = votes.find((v) => v.type === "UP")?._count ?? 0;
  const downVote = votes.find((v) => v.type === "DOWN")?._count ?? 0;

  return (
    <Card className="group bg-background rounded-2xl border border-foreground/20 p-6 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex items-center justify-between flex-row mb-4">
      <CardHeader className="p-0 w-full">
        <Link href={`/project/details/${projectId}/release/${id}`}>
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors capitalize mb-2">
            {title}
          </CardTitle>
          <CardDescription className="text-foreground/50 text-sm leading-relaxed line-clamp-3">
            {description}
          </CardDescription>
        </Link>
      </CardHeader>
      <CardContent className="p-0 w-full">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={checkStatus(status)}>{status}</Badge>
          <Badge variant={checkVisibility(visibility)}>{visibility}</Badge>
        </div>
        <AvatarGroup className="my-4">
          {images.slice(0, MAX_IMAGE).map((img, ind) => (
            <Avatar key={ind}>
              <AvatarImage src={img.url} alt="project_image" />
              <AvatarFallback>{ind + 1}</AvatarFallback>
            </Avatar>
          ))}
          {images.length > MAX_IMAGE && (
            <AvatarGroupCount>+ {images.length - MAX_IMAGE}</AvatarGroupCount>
          )}
        </AvatarGroup>
      </CardContent>
      <CardFooter className="p-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-green-500">
            <TrendingUpIcon className="w-4 h-4" />
            <span className="text-xs font-medium">{upVote}</span>
          </div>
          <div className="flex items-center gap-1 text-red-500">
            <TrendingDownIcon className="w-4 h-4" />
            <span className="text-xs font-medium">{downVote}</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <ViewIcon className="w-4 h-4" />
            <span className="text-xs font-medium">{views}</span>
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <StarIcon className="w-4 h-4" />
            <span className="text-xs font-bold truncate">
              {reviewStats._avg.rating?.toFixed(1)} ({reviewStats._count.id})
            </span>
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <MessageSquareIcon className="w-4 h-4" />
            <span className="text-xs font-bold">{_count.comments}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReleaseCard;
