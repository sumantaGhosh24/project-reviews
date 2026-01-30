"use client";

import {LoaderIcon} from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <Empty className="shadow-md container mx-auto h-[450px] dark:shadow-gray-200">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LoaderIcon className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>Loading...</EmptyTitle>
          <EmptyDescription>Please wait</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
};

export default LoadingComponent;
