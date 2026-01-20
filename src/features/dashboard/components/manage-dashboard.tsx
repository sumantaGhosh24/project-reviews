"use client";

import {
  BellIcon,
  FolderClosedIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  UserCheckIcon,
  UserRoundCheckIcon,
  VoteIcon,
  ViewIcon,
  BellDotIcon,
  UserIcon,
  UsersIcon,
  UserLockIcon,
  TagsIcon,
  FolderIcon,
  FolderCogIcon,
  FolderClockIcon,
  FolderCheckIcon,
  FolderXIcon,
  FolderLockIcon,
  FolderUpIcon,
  FileIcon,
  FileCogIcon,
  FileClockIcon,
  FileCheckIcon,
  FileXIcon,
  FileLockIcon,
  FileUpIcon,
  MessageCircleDashedIcon,
  BellMinusIcon,
} from "lucide-react";

import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";

import {
  useSuspenseAdminDashboard,
  useSuspenseDashboard,
} from "../hooks/use-dashboard";
import StatCard from "./stat-card";

const ManageDashboard = () => {
  const {data: dashboard} = useSuspenseDashboard();

  const {data: adminDashboard} = useSuspenseAdminDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={dashboard.image ?? "https://placehold.co/600x400.png"}
            />
            <AvatarFallback>{dashboard.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold capitalize">
              Welcome back, {dashboard.name} 👋
            </h2>
            <p className="text-muted-foreground">
              Here’s what’s happening today
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard
          title="Projects"
          value={dashboard.counts.projects}
          icon={<FolderClosedIcon />}
        />
        <StatCard
          title="Comments"
          value={dashboard.counts.comments}
          icon={<MessageCircleIcon />}
        />
        <StatCard
          title="Reviews"
          value={dashboard.counts.reviews}
          icon={<MessageSquareIcon />}
        />
        <StatCard
          title="Followers"
          value={dashboard.counts.followers}
          icon={<UserCheckIcon />}
        />
        <StatCard
          title="Followings"
          value={dashboard.counts.following}
          icon={<UserRoundCheckIcon />}
        />
        <StatCard
          title="Votes Given"
          value={dashboard.counts.votesGiven}
          icon={<VoteIcon />}
        />
        <StatCard
          title="Views Given"
          value={dashboard.counts.viewsGiven}
          icon={<ViewIcon />}
        />
        <StatCard
          title="Votes Received"
          value={dashboard.engagement.votesReceived}
          icon={<VoteIcon />}
        />
        <StatCard
          title="Views Received"
          value={dashboard.engagement.viewsReceived}
          icon={<ViewIcon />}
        />
        <StatCard
          title="Unread Notifications"
          value={dashboard.notifications.unread}
          icon={<BellDotIcon />}
        />
        <StatCard
          title="Total Notifications"
          value={dashboard.notifications.total}
          icon={<BellIcon />}
        />
      </div>
      {!adminDashboard?.unauthorized && (
        <>
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <StatCard
              title="Total Users"
              value={adminDashboard?.user?.total ?? 0}
              icon={<UsersIcon />}
            />
            <StatCard
              title="Total Admins"
              value={adminDashboard?.user?.admin ?? 0}
              icon={<UserLockIcon />}
            />
            <StatCard
              title="Total Normal Users"
              value={adminDashboard?.user?.normal ?? 0}
              icon={<UserIcon />}
            />
            <StatCard
              title="Total Categories"
              value={adminDashboard?.category?.total ?? 0}
              icon={<TagsIcon />}
            />
            <StatCard
              title="Total Projects"
              value={adminDashboard?.project?.total ?? 0}
              icon={<FolderIcon />}
            />
            <StatCard
              title="Total Draft Projects"
              value={adminDashboard?.project?.draft ?? 0}
              icon={<FolderCogIcon />}
            />
            <StatCard
              title="Total Development Projects"
              value={adminDashboard?.project?.development ?? 0}
              icon={<FolderClockIcon />}
            />
            <StatCard
              title="Total Production Projects"
              value={adminDashboard?.project?.production ?? 0}
              icon={<FolderCheckIcon />}
            />
            <StatCard
              title="Total Deprecated Projects"
              value={adminDashboard?.project?.deprecated ?? 0}
              icon={<FolderXIcon />}
            />
            <StatCard
              title="Total Private Projects"
              value={adminDashboard?.project?.private ?? 0}
              icon={<FolderLockIcon />}
            />
            <StatCard
              title="Total Public Projects"
              value={adminDashboard?.project?.public ?? 0}
              icon={<FolderUpIcon />}
            />
            <StatCard
              title="Total Releases"
              value={adminDashboard?.release?.total ?? 0}
              icon={<FileIcon />}
            />
            <StatCard
              title="Total Draft Releases"
              value={adminDashboard?.release?.draft ?? 0}
              icon={<FileCogIcon />}
            />
            <StatCard
              title="Total Development Releases"
              value={adminDashboard?.release?.development ?? 0}
              icon={<FileClockIcon />}
            />
            <StatCard
              title="Total Production Releases"
              value={adminDashboard?.release?.production ?? 0}
              icon={<FileCheckIcon />}
            />
            <StatCard
              title="Total Deprecated Releases"
              value={adminDashboard?.release?.deprecated ?? 0}
              icon={<FileXIcon />}
            />
            <StatCard
              title="Total Private Releases"
              value={adminDashboard?.release?.private ?? 0}
              icon={<FileLockIcon />}
            />
            <StatCard
              title="Total Public Releases"
              value={adminDashboard?.release?.public ?? 0}
              icon={<FileUpIcon />}
            />
            <StatCard
              title="Total Comments"
              value={adminDashboard?.comment?.total ?? 0}
              icon={<MessageCircleIcon />}
            />
            <StatCard
              title="Total Reply Comments"
              value={adminDashboard?.comment?.reply ?? 0}
              icon={<MessageCircleDashedIcon />}
            />
            <StatCard
              title="Total Reviews"
              value={adminDashboard?.review?.total ?? 0}
              icon={<MessageSquareIcon />}
            />
            <StatCard
              title="Total Votes"
              value={adminDashboard?.vote?.total ?? 0}
              icon={<VoteIcon />}
            />
            <StatCard
              title="Total Up Votes"
              value={adminDashboard?.vote?.up ?? 0}
              icon={<VoteIcon />}
            />
            <StatCard
              title="Total Down Votes"
              value={adminDashboard?.vote?.down ?? 0}
              icon={<VoteIcon />}
            />
            <StatCard
              title="Total Project Votes"
              value={adminDashboard?.vote?.project ?? 0}
              icon={<VoteIcon />}
            />
            <StatCard
              title="Total Release Votes"
              value={adminDashboard?.vote?.release ?? 0}
              icon={<VoteIcon />}
            />
            <StatCard
              title="Total Comment Votes"
              value={adminDashboard?.vote?.comment ?? 0}
              icon={<VoteIcon />}
            />
            <StatCard
              title="Total Review Votes"
              value={adminDashboard?.vote?.review ?? 0}
              icon={<VoteIcon />}
            />
            <StatCard
              title="Total Views"
              value={adminDashboard?.view?.total ?? 0}
              icon={<ViewIcon />}
            />
            <StatCard
              title="Total Project Views"
              value={adminDashboard?.view?.project ?? 0}
              icon={<ViewIcon />}
            />
            <StatCard
              title="Total Release Views"
              value={adminDashboard?.view?.release ?? 0}
              icon={<ViewIcon />}
            />
            <StatCard
              title="Total Notifications"
              value={adminDashboard?.notification?.total ?? 0}
              icon={<BellIcon />}
            />
            <StatCard
              title="Total Unread Notifications"
              value={adminDashboard?.notification?.unread ?? 0}
              icon={<BellDotIcon />}
            />
            <StatCard
              title="Total Read Notifications"
              value={adminDashboard?.notification?.read ?? 0}
              icon={<BellMinusIcon />}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageDashboard;
