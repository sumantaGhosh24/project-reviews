import Link from "next/link";
import {
  ExternalLinkIcon,
  GithubIcon,
  StarIcon,
  TimerResetIcon,
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
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Project} from "@/generated/prisma/client";

interface ProjectCardProps extends Project {
  category: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  _count: {
    releases: number;
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
  images: {
    id: string;
    target: string;
    targetId: string;
    url: string;
  }[];
}

const MAX_IMAGE = 3;

const ProjectCard = ({
  id,
  title,
  description,
  status,
  visibility,
  owner,
  category,
  tags,
  githubUrl,
  websiteUrl,
  _count,
  votes,
  views,
  reviewStats,
  images,
}: ProjectCardProps) => {
  const upVote = votes.find((v) => v.type === "UP")?._count ?? 0;
  const downVote = votes.find((v) => v.type === "DOWN")?._count ?? 0;

  return (
    <Card className="group bg-background rounded-2xl border border-foreground/20 p-6 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded truncate">
          {category.name}
        </span>
        <div className="flex gap-2">
          <Button size="icon" asChild>
            <Link href={githubUrl} target="_blank">
              <GithubIcon size={24} />
            </Link>
          </Button>
          <Button size="icon" asChild>
            <Link href={websiteUrl} target="_blank">
              <ExternalLinkIcon size={24} />
            </Link>
          </Button>
        </div>
      </div>
      <CardHeader className="p-0">
        <Link href={`/project/details/${id}`}>
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors capitalize mb-2">
            {title}
          </CardTitle>
          <CardDescription className="text-foreground/50 text-sm leading-relaxed line-clamp-3">
            {description}
          </CardDescription>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <AvatarGroup className="mb-4">
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
        <div className="flex items-center gap-2 flex-wrap">
          {tags?.map((tag, ind) => (
            <Badge key={`${tag}-${ind}`} className="uppercase">
              {tag}
            </Badge>
          ))}
          <Badge variant={checkStatus(status)}>{status}</Badge>
          <Badge variant={checkVisibility(visibility)}>{visibility}</Badge>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2 mt-4">
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
            <TimerResetIcon className="w-4 h-4" />
            <span className="text-xs font-medium">{_count?.releases}</span>
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <StarIcon className="w-4 h-4" />
            <span className="text-xs font-medium">
              {reviewStats._avg.rating?.toFixed(1)} ({reviewStats._count.id})
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-0">
        <div>
          <Link
            href={`/profile/${owner?.id}/details`}
            className="flex items-center gap-2"
          >
            <Avatar>
              <AvatarFallback>{owner?.name?.substring(0, 2)}</AvatarFallback>
              <AvatarImage
                src={owner?.image ?? "https://placehold.co/600x400.png"}
              />
            </Avatar>
            <span className="text-md font-bold text-foreground/60 capitalize">
              {owner?.name}
            </span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
