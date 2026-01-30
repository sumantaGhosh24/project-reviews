"use client";

import {useState, type ChangeEvent} from "react";
import Image from "next/image";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {SendIcon, UploadIcon} from "lucide-react";

import {isBase64Image} from "@/lib/utils";
import {useUploadThing} from "@/lib/uploadthing";
import {LoadingSwap} from "@/components/loading-swap";
import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";

import {useCreateComment} from "../hooks/use-comments";

const createCommentSchema = z.object({
  body: z.string().trim().toLowerCase().min(1).max(500),
  imageUrl: z.optional(z.string()),
});

type CreateCommentFormType = z.infer<typeof createCommentSchema>;

interface CreateCommentFormProps {
  releaseId: string;
}

export function CreateCommentForm({releaseId}: CreateCommentFormProps) {
  const [files, setFiles] = useState<File[]>([]);

  const {startUpload, isUploading} = useUploadThing("imageUploader");

  const form = useForm<CreateCommentFormType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: "",
      imageUrl: "",
    },
  });

  const createComment = useCreateComment();

  const onSubmit = async (values: CreateCommentFormType) => {
    if (files) {
      const blob = values.imageUrl;
      const hasImageChanged = isBase64Image(blob!);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);
        if (imgRes && imgRes[0].ufsUrl) {
          values.imageUrl = imgRes[0].ufsUrl;
        }
      }

      createComment.mutate(
        {
          body: values.body,
          imageUrl: values.imageUrl,
          releaseId,
        },
        {
          onSuccess: () => {
            form.reset();
            setFiles([]);
          },
        }
      );
    } else {
      createComment.mutate(
        {
          body: values.body,
          releaseId,
        },
        {
          onSuccess: () => {
            form.reset();
            setFiles([]);
          },
        }
      );
    }
  };

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
    <div className="rounded-lg border bg-background p-2">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-row items-center gap-2">
          <Controller
            control={form.control}
            name="imageUrl"
            render={({field, fieldState}) => (
              <Field
                data-invalid={fieldState.invalid}
                className="border h-16 max-w-20 rounded-md grid place-items-center"
              >
                <FieldLabel
                  htmlFor={field.name}
                  className="grid place-items-center cursor-pointer"
                >
                  {field.value ? (
                    <Image
                      src={field.value}
                      alt="comment image"
                      width={96}
                      height={96}
                      priority
                      className="h-16 max-w-20 rounded-md"
                    />
                  ) : (
                    <UploadIcon size={32} className="text-foreground" />
                  )}
                </FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add comment image"
                  onChange={(e) => handleImage(e, field.onChange)}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  hidden
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="body"
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid} className="max-w-fill">
                <Textarea
                  placeholder="Enter your message..."
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            type="submit"
            disabled={createComment.isPending || isUploading}
            className="max-w-20 h-16"
          >
            <LoadingSwap isLoading={createComment.isPending || isUploading}>
              <SendIcon />
            </LoadingSwap>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
