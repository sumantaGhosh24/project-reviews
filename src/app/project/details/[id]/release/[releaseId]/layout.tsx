import type {ReactNode} from "react";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function Layout({
  children,
  comments,
  reviews,
}: {
  children: ReactNode;
  comments: ReactNode;
  reviews: ReactNode;
}) {
  return (
    <div className="mx-auto my-5 w-[95%] rounded-md shadow-md p-5 bg-background dark:shadow-white/40">
      <div className="space-y-5">
        {children}
        <Tabs defaultValue="comments" className="w-full">
          <TabsList>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="comments">{comments}</TabsContent>
          <TabsContent value="reviews">{reviews}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
