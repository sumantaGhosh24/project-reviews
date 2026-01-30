"use client";

import {useRouter} from "next/navigation";
import {
  MessageCircleDashedIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  StarIcon,
  ViewIcon,
  VoteIcon,
} from "lucide-react";

import {useSuspenseReleaseDashboard} from "@/features/dashboard/hooks/use-dashboard";
import StatCard from "@/features/dashboard/components/stat-card";
import {Button} from "@/components/ui/button";

interface ReleaseAnalyticsProps {
  releaseId: string;
}

const ReleaseAnalytics = ({releaseId}: ReleaseAnalyticsProps) => {
  const {data: dashboard} = useSuspenseReleaseDashboard(releaseId);

  const router = useRouter();

  if (dashboard.unauthorized) return null;

  return (
    <div className="container mx-auto my-5 rounded-md shadow-md p-5 bg-background dark:shadow-white/40 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="capitalize text-2xl">
          {dashboard?.release?.title} - Analytics
        </h3>
        <Button onClick={() => router.back()} variant="outline">
          Back to Release
        </Button>
      </div>
      <p>{dashboard?.release?.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
        <StatCard
          title="Total Comments"
          value={dashboard?.counts?.comments ?? 0}
          icon={<MessageCircleIcon />}
        />
        <StatCard
          title="Total Replies"
          value={dashboard?.counts?.replies ?? 0}
          icon={<MessageCircleDashedIcon />}
        />
        <StatCard
          title="Total Reviews"
          value={dashboard?.counts?.reviews ?? 0}
          icon={<MessageSquareIcon />}
        />
        <StatCard
          title="Release Votes"
          value={dashboard?.engagement?.votes ?? 0}
          icon={<VoteIcon />}
        />
        <StatCard
          title="Release Views"
          value={dashboard?.engagement?.views ?? 0}
          icon={<ViewIcon />}
        />
        <StatCard
          title="Rating"
          value={`${dashboard?.ratings?.average.toFixed(1)} (${
            dashboard?.ratings?.total
          })`}
          icon={<StarIcon />}
        />
        {dashboard?.ratings?.distribution?.map((d) => (
          <div key={d.rating}>
            <StatCard
              title={`Rating ${d.rating}`}
              value={d._count.rating}
              icon={<StarIcon />}
            />
          </div>
        ))}
        {dashboard?.votes?.breakdown?.map((d) => (
          <div key={d.type}>
            <StatCard
              title={`${d.type} Votes`}
              value={d._count.type}
              icon={<VoteIcon />}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReleaseAnalytics;
