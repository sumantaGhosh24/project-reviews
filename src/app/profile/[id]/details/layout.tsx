import type {ReactNode} from "react";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function Layout({
  children,
  followers,
  followings,
  posts,
}: {
  children: ReactNode;
  followers: ReactNode;
  followings: ReactNode;
  posts: ReactNode;
}) {
  return (
    <div className="space-y-8 container mx-auto my-5 bg-background dark:shadow-white/40 p-5 shadow-md rounded-md">
      {children}
      <Tabs defaultValue="posts" className="space-y-4">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
          <TabsList className="inline-flex w-full min-w-[480px]">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="posts">{posts}</TabsContent>
        <TabsContent value="following">{followings}</TabsContent>
        <TabsContent value="followers">{followers}</TabsContent>
      </Tabs>
    </div>
  );
}
