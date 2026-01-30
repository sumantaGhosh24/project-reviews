"use client";

import {type ChangeEvent, useState} from "react";
import Image from "next/image";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {XIcon} from "lucide-react";

import {useUploadThing} from "@/lib/uploadthing";
import {LoadingSwap} from "@/components/loading-swap";
import {Input} from "@/components/ui/input";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Release} from "@/generated/prisma/client";

import {useAddReleaseImage} from "../hooks/use-releases";

interface AddReleaseImageProps {
  release: Release;
}

const addReleaseImageSchema = z.object({
  imageUrl: z.array(z.string()),
});

type AddReleaseImageFormType = z.infer<typeof addReleaseImageSchema>;

const AddReleaseImage = ({release}: AddReleaseImageProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const MAX_IMAGE_COUNT = 5;

  const {startUpload, isUploading} = useUploadThing("imageUploader");

  const form = useForm<AddReleaseImageFormType>({
    resolver: zodResolver(addReleaseImageSchema),
    defaultValues: {
      imageUrl: [],
    },
  });

  const addReleaseImage = useAddReleaseImage();

  const onSubmit = async (values: AddReleaseImageFormType) => {
    if (!files.length) return toast.error("Please add an image.");

    const imgRes = await startUpload(files);
    if (!imgRes || !imgRes.length) {
      toast.error("Image upload failed.");
      return;
    }
    values.imageUrl = imgRes.map((img) => img.ufsUrl);

    addReleaseImage.mutate(
      {
        id: release.id,
        ...values,
      },
      {
        onSuccess: () => {
          setFiles([]);
          form.reset();
        },
      }
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (!selected.length) return;
    const imageFiles = selected.filter((f) => f.type.includes("image"));
    if (!imageFiles.length) {
      toast.error("Please select image files.");
      return;
    }
    setFiles((prev) => {
      const remainingSlots = Math.max(0, MAX_IMAGE_COUNT - prev.length);
      const toAdd = imageFiles.slice(0, remainingSlots);
      if (imageFiles.length > remainingSlots) {
        toast.error(`You can upload up to ${MAX_IMAGE_COUNT} images.`);
      }
      return [...prev, ...toAdd];
    });
    e.target.value = "";
  };

  const handleRemovedFile = (id: number) => {
    setFiles((files) => files.filter((_, i) => i !== id));
  };

  return (
    <form
      className="flex flex-col justify-start gap-10"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h1 className="mb-5 text-2xl font-bold">Add Release Image</h1>
      <div className="mb-5 flex flex-wrap items-start gap-3">
        {files.map((file, i) => (
          <Card className="relative mx-auto mb-5 !max-h-fit" key={i}>
            <CardContent className="p-0">
              <Image
                src={URL.createObjectURL(file)}
                alt="file"
                width={200}
                height={200}
                className="h-[100px] w-[100px] rounded object-cover"
              />
              <XIcon
                className="absolute right-1 top-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-gray-200 p-1 text-red-700 transition-all hover:bg-red-700 hover:text-gray-200"
                onClick={() => handleRemovedFile(i)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="releaseImages">Select Release Images</FieldLabel>
          <div className="flex-1 text-base font-semibold text-gray-200 mt-3">
            <Input
              type="file"
              accept="image/*"
              placeholder="Add release images"
              className="cursor-pointer border-none bg-transparent outline-none file:text-blue-500"
              onChange={handleImageChange}
              id="releaseImages"
              multiple
              disabled={isUploading || addReleaseImage.isPending}
            />
          </div>
        </Field>
        <Button
          type="submit"
          disabled={isUploading || addReleaseImage.isPending}
          className="w-full"
        >
          <LoadingSwap isLoading={isUploading || addReleaseImage.isPending}>
            Add Release Image
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};

export default AddReleaseImage;
