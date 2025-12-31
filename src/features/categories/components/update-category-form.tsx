"use client";

import {type ChangeEvent, useState} from "react";
import Image from "next/image";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";

import {Input} from "@/components/ui/input";
import {LoadingSwap} from "@/components/loading-swap";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";

interface UpdateCategoryFormProps {
  id: string;
}

const updateCategorySchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().min(1),
});

type UpdateCategoryForm = z.infer<typeof updateCategorySchema>;

const UpdateCategoryForm = ({id}: UpdateCategoryFormProps) => {
  // TODO:
  const category = {
    id: "1",
    name: "Category 1",
    imageUrl: "https://placehold.co/600x400.png",
  };

  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<UpdateCategoryForm>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category?.name,
      imageUrl: category?.imageUrl,
    },
  });

  const onSubmit = async (values: UpdateCategoryForm) => {
    if (!files) return toast.error("Please add an image.");

    // TODO:
    console.log(values);

    setFiles([]);
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
    <div className="container mx-auto space-y-4 rounded-md shadow-md p-5 bg-background dark:shadow-white/40 my-20">
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="mb-5 text-2xl font-bold">Update Category</h1>
        <FieldGroup>
          <Controller
            control={form.control}
            name="imageUrl"
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="flex h-48 w-24 items-center justify-center rounded-full bg-gray-200 cursor-pointer"
                >
                  {field.value && (
                    <Image
                      src={field.value}
                      alt="profile_icon"
                      width={400}
                      height={100}
                      priority
                      className="rounded-full object-cover h-48 w-full"
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="name"
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                <Input
                  type="name"
                  placeholder="Enter category name"
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
            // disabled={isUploading || updateCategory.isPending}
            className="w-full"
          >
            <LoadingSwap
              isLoading={false}
              //  isLoading={isUploading || updateCategory.isPending}
            >
              Update Category
            </LoadingSwap>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default UpdateCategoryForm;
