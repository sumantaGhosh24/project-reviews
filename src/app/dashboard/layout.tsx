import type {ReactNode} from "react";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function Layout({
  children,
  projects,
}: {
  children: ReactNode;
  followers: ReactNode;
  followings: ReactNode;
  projects: ReactNode;
}) {
  return (
    <div className="space-y-8 container mx-auto bg-background dark:shadow-white/40 p-5 shadow-md rounded-md my-5">
      {children}
      <Tabs defaultValue="projects" className="space-y-4">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
          <TabsList className="inline-flex w-full min-w-[480px]">
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="projects">{projects}</TabsContent>
      </Tabs>
    </div>
  );
}
