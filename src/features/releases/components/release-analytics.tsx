"use client";

import {
  LayoutDashboardIcon,
  MessageCircleDashedIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  StarIcon,
  ViewIcon,
  VoteIcon,
} from "lucide-react";

import {useSuspenseReleaseDashboard} from "@/features/dashboard/hooks/use-dashboard";
import StatCard from "@/features/dashboard/components/stat-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";

interface ReleaseAnalyticsProps {
  releaseId: string;
}

const ReleaseAnalytics = ({releaseId}: ReleaseAnalyticsProps) => {
  const {data: dashboard} = useSuspenseReleaseDashboard(releaseId);

  if (dashboard.unauthorized) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          <LayoutDashboardIcon className="h-4 w-4 mr-2" /> View Analytics
        </Button>
      </DrawerTrigger>
      <DrawerContent className="container mx-auto h-[80vh] px-5">
        <DrawerHeader>
          <DrawerTitle className="capitalize text-xl">
            {dashboard?.release?.title} - Analytics
          </DrawerTitle>
          <DrawerDescription>
            {dashboard?.release?.description}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="min-h-[60vh]">
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
              value={`${dashboard?.ratings?.average}(${dashboard?.ratings?.total})`}
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
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="destructive" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ReleaseAnalytics;
