import Link from "next/link";
import {
  ExternalLinkIcon,
  MessageSquareIcon,
  TimerResetIcon,
  TrendingUpIcon,
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
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
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
}

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
}: ProjectCardProps) => (
  <Card className="group bg-background rounded-2xl border border-foreground/20 p-6 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
        {category.name}
      </span>
      <div className="flex items-center gap-1 text-foreground/50">
        <TrendingUpIcon className="w-3 h-3" />
        <span className="text-xs font-medium">{0}</span>
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
    <CardContent className="p-0 flex items-center gap-2 flex-wrap">
      {tags?.map((tag, ind) => (
        <Badge key={`${tag}-${ind}`} className="uppercase">
          {tag}
        </Badge>
      ))}
      <Badge variant={checkStatus(status)}>{status}</Badge>
      <Badge variant={checkVisibility(visibility)}>{visibility}</Badge>
      <Button size="sm" asChild>
        <Link href={githubUrl} target="_blank">
          <ExternalLinkIcon size={24} /> Visit Github
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href={websiteUrl} target="_blank">
          <ExternalLinkIcon size={24} /> Visit Website
        </Link>
      </Button>
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
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-foreground/50">
          <MessageSquareIcon className="w-4 h-4" />
          <span className="text-xs font-bold">{0}</span>
        </div>
        <div className="flex items-center gap-1.5 text-foreground/50">
          <TimerResetIcon className="w-4 h-4" />
          <span className="text-xs font-bold">{_count?.releases}</span>
        </div>
      </div>
    </CardFooter>
  </Card>
);

export default ProjectCard;
