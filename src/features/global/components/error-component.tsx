"use client";

import {useRouter} from "next/navigation";
import {AlertCircleIcon} from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {Button} from "@/components/ui/button";

interface ErrorComponentProps {
  title: string;
  description: string;
  buttonText: string;
  redirectUrl: string;
}

const ErrorComponent = ({
  title,
  description,
  buttonText,
  redirectUrl,
}: ErrorComponentProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <Empty className="shadow-md container mx-auto h-[450px] dark:shadow-gray-200">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircleIcon />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(redirectUrl)}>
              {buttonText}
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default ErrorComponent;
