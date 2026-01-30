"use client";

import Image from "next/image";
import {XIcon} from "lucide-react";

import {LoadingSwap} from "@/components/loading-swap";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Image as ImageProps} from "@/generated/prisma/client";

import {useRemoveReleaseImage} from "../hooks/use-releases";

interface RemoveReleaseImageProps {
  id: string;
  images: ImageProps[];
}

const RemoveReleaseImage = ({id, images}: RemoveReleaseImageProps) => {
  const removeReleaseImage = useRemoveReleaseImage();

  const handleDelete = async (imageId: string) => {
    removeReleaseImage.mutate({
      id,
      imageId,
    });
  };

  return (
    <div className="flex flex-col justify-start gap-10">
      <h1 className="mb-5 text-2xl font-bold">Remove Release Image</h1>
      <div className="mb-5 flex flex-wrap items-start gap-3">
        {images.map((image, i) => (
          <Card className="relative mx-auto mb-5 !max-h-fit" key={i}>
            <CardContent className="p-0">
              <Image
                src={image.url}
                alt="file"
                width={200}
                height={200}
                className="h-[100px] w-[100px] rounded object-cover"
              />
              <Button
                className="absolute right-1 top-1"
                disabled={removeReleaseImage.isPending}
                onClick={() => handleDelete(image.id)}
                variant="destructive"
              >
                <LoadingSwap isLoading={removeReleaseImage.isPending}>
                  <XIcon size={24} />
                </LoadingSwap>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RemoveReleaseImage;
