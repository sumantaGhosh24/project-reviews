"use client";

import Link from "next/link";
import {ArrowLeftIcon} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import {useSuspenseRelease} from "../hooks/use-releases";
import UpdateReleaseForm from "./update-release-form";
import AddReleaseImage from "./add-release-image";
import RemoveReleaseImage from "./remove-release-image";

interface UpdateReleaseComponent {
  id: string;
  releaseId: string;
}

const UpdateReleaseComponent = ({id, releaseId}: UpdateReleaseComponent) => {
  const {data: release} = useSuspenseRelease(releaseId);

  return (
    <div className="container mx-auto space-y-4 rounded-md shadow-md p-5 bg-background dark:shadow-white/40 my-20">
      <Button asChild>
        <Link href={`/project/details/${id}/release/${releaseId}`}>
          <ArrowLeftIcon className="h-4 w-4" /> Back to Release
        </Link>
      </Button>
      <Tabs defaultValue="update-release" className="w-full">
        <TabsList className="grid grid-cols-3 mb-5">
          <TabsTrigger value="update-release">Update Release</TabsTrigger>
          <TabsTrigger value="add-image">Add Release Image</TabsTrigger>
          <TabsTrigger value="remove-image">Remove Release Image</TabsTrigger>
        </TabsList>
        <TabsContent value="update-release">
          <UpdateReleaseForm release={release} />
        </TabsContent>
        <TabsContent value="add-image">
          <AddReleaseImage release={release} />
        </TabsContent>
        <TabsContent value="remove-image">
          <RemoveReleaseImage id={release.id} images={release.images} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpdateReleaseComponent;
