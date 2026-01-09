import ProfileDetails from "@/features/profile/components/profile-details";
import ProfilePosts from "@/features/profile/components/profile-posts";
import ProfileFollowings from "@/features/profile/components/profile-followings";
import ProfileFollowers from "@/features/profile/components/profile-followers";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function ProfilePage() {
  return (
    <div className="space-y-8 container mx-auto my-5 bg-background dark:shadow-white/40 p-5 shadow-md rounded-md">
      <ProfileDetails />
      <Tabs defaultValue="posts" className="space-y-4">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
          <TabsList className="inline-flex w-full min-w-[480px]">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="posts">
          <ProfilePosts />
        </TabsContent>
        <TabsContent value="following">
          <ProfileFollowings />
        </TabsContent>
        <TabsContent value="followers">
          <ProfileFollowers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
