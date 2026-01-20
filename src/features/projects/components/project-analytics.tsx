"use client";

import {
  FileIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  StarIcon,
  ViewIcon,
  VoteIcon,
} from "lucide-react";

import {useSuspenseProjectDashboard} from "@/features/dashboard/hooks/use-dashboard";
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

interface ProjectAnalyticsProps {
  projectId: string;
}

const ProjectAnalytics = ({projectId}: ProjectAnalyticsProps) => {
  const {data: dashboard} = useSuspenseProjectDashboard(projectId);

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
            {dashboard?.project?.title} - Analytics
          </DrawerTitle>
          <DrawerDescription>
            {dashboard?.project?.description}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="max-h-[60vh]">
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
              value={`${dashboard?.ratings?.average}(${dashboard?.ratings?.total})`}
              icon={<StarIcon />}
            />
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

export default ProjectAnalytics;
