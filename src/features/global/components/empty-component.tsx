"use client";

import {useRouter} from "next/navigation";
import {FolderCodeIcon} from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {Button} from "@/components/ui/button";

interface EmptyComponentProps {
  title: string;
  description: string;
  buttonText: string;
  redirectUrl: string;
}

const EmptyComponent = ({
  title,
  description,
  buttonText,
  redirectUrl,
}: EmptyComponentProps) => {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={() => router.push(redirectUrl)}>{buttonText}</Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyComponent;
