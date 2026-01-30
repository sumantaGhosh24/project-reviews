"use client";

import {type ChangeEvent, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {toast} from "sonner";

import {isBase64Image} from "@/lib/utils";
import {useUploadThing} from "@/lib/uploadthing";
import {authClient} from "@/lib/auth/auth-client";
import {LoadingSwap} from "@/components/loading-swap";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";

const profileUpdateImageSchema = z.object({
  imageUrl: z.string().min(1),
});

type ProfileUpdateImageFormType = z.infer<typeof profileUpdateImageSchema>;

export function ProfileUpdateImageForm({image}: {image?: string | null}) {
  const [files, setFiles] = useState<File[]>([]);

  const {startUpload, isUploading} = useUploadThing("imageUploader");

  const router = useRouter();

  const form = useForm<ProfileUpdateImageFormType>({
    resolver: zodResolver(profileUpdateImageSchema),
    defaultValues: {
      imageUrl:
        image ??
        "https://w3bkow2cit.ufs.sh/f/jLzp5qrLYh1KWP2CB5X5THxLaA1rNpE8DRtju7ZhPmKs2MoF",
    },
  });

  const {isSubmitting} = form.formState;

  async function handleProfileUpdate(data: ProfileUpdateImageFormType) {
    if (!files) return toast.error("Please add an image.");

    const blob = data.imageUrl;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0].ufsUrl) {
        data.imageUrl = imgRes[0].ufsUrl;
      }
    }

    const promises = [
      authClient.updateUser({
        image: data.imageUrl,
      }),
    ];

    const res = await Promise.all(promises);

    const updateUserResult = res[0];

    if (updateUserResult.error) {
      toast.error(
        updateUserResult.error.message || "Failed to update profile image"
      );
    } else {
      toast.success("Profile image updated successfully");
      router.refresh();
    }
  }

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(handleProfileUpdate)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="imageUrl"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={field.name}
                className="h-48 max-w-fit rounded-full bg-gray-200 cursor-pointer mx-auto"
              >
                {field.value && (
                  <Image
                    src={field.value}
                    alt="profile_icon"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-cover h-48 w-48"
                  />
                )}
              </FieldLabel>
              <div className="flex-1 text-base font-semibold text-gray-200 mt-3">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add profile photo"
                  className="cursor-pointer border-none bg-transparent outline-none file:text-blue-500"
                  onChange={(e) => handleImage(e, field.onChange)}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="w-full"
        >
          <LoadingSwap isLoading={isSubmitting || isUploading}>
            Update Profile Image
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
}
