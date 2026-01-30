"use client";

import {useRouter} from "next/navigation";
import {
  FileIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  StarIcon,
  ViewIcon,
  VoteIcon,
} from "lucide-react";

import {useSuspenseProjectDashboard} from "@/features/dashboard/hooks/use-dashboard";
import StatCard from "@/features/dashboard/components/stat-card";
import {Button} from "@/components/ui/button";

interface ProjectAnalyticsProps {
  projectId: string;
}

const ProjectAnalytics = ({projectId}: ProjectAnalyticsProps) => {
  const {data: dashboard} = useSuspenseProjectDashboard(projectId);

  const router = useRouter();

  if (dashboard.unauthorized) return null;

  return (
    <div className="mx-auto my-5 container rounded-md shadow-md p-5 bg-background dark:shadow-white/40 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="capitalize text-2xl">
          {dashboard?.project?.title} - Analytics
        </h3>
        <Button onClick={() => router.back()} variant="outline">
          Back to Project
        </Button>
      </div>
      <p>{dashboard?.project?.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
        <StatCard
          title="Total Releases"
          value={dashboard?.counts?.releases ?? 0}
          icon={<FileIcon />}
        />
        <StatCard
          title="Total Comments"
          value={dashboard?.counts?.comments ?? 0}
          icon={<MessageCircleIcon />}
        />
        <StatCard
          title="Total Reviews"
          value={dashboard?.counts?.reviews ?? 0}
          icon={<MessageSquareIcon />}
        />
        <StatCard
          title="Project Votes"
          value={dashboard?.engagement?.project?.votes ?? 0}
          icon={<VoteIcon />}
        />
        <StatCard
          title="Project Views"
          value={dashboard?.engagement?.project?.views ?? 0}
          icon={<ViewIcon />}
        />
        <StatCard
          title="Releases Votes"
          value={dashboard?.engagement?.releases?.votes ?? 0}
          icon={<VoteIcon />}
        />
        <StatCard
          title="Releases Views"
          value={dashboard?.engagement?.releases?.views ?? 0}
          icon={<ViewIcon />}
        />
        <StatCard
          title="Rating"
          value={`${dashboard?.ratings?.average.toFixed(1)} (${
            dashboard?.ratings?.total
          })`}
          icon={<StarIcon />}
        />
      </div>
    </div>
  );
};

export default ProjectAnalytics;
