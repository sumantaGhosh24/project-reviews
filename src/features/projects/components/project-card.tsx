import {MessageSquareIcon, TrendingUpIcon} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProjectCardProps {
  id: number;
  title: string;
  category: string;
  description: string;
  author: string;
  reviews: number;
  upvotes: number;
}

const ProjectCard = ({
  title,
  category,
  description,
  author,
  reviews,
  upvotes,
}: ProjectCardProps) => (
  <Card className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
        {category}
      </span>
      <div className="flex items-center gap-1 text-slate-400">
        <TrendingUpIcon className="w-3 h-3" />
        <span className="text-xs font-medium">{upvotes}</span>
      </div>
    </div>
    <CardHeader className="p-0">
      <CardTitle className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </CardTitle>
      <CardDescription className="text-slate-500 text-sm leading-relaxed line-clamp-3">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent className="p-0">
      <p>content</p>
    </CardContent>
    <CardFooter className="flex items-center justify-between p-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
          {author[0]}
        </div>
        <span className="text-xs font-semibold text-slate-700">{author}</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-500">
        <MessageSquareIcon className="w-4 h-4" />
        <span className="text-xs font-bold">{reviews}</span>
      </div>
    </CardFooter>
  </Card>
);

export default ProjectCard;
