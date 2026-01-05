"use client";

import {type ChangeEvent, useState} from "react";
import Image from "next/image";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {XIcon} from "lucide-react";

import {LoadingSwap} from "@/components/loading-swap";
import {Input} from "@/components/ui/input";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";

const createProjectSchema = z.object({
  title: z.string().trim().toLowerCase().min(1).max(25),
  description: z.string().trim().toLowerCase().min(1).max(100),
  content: z.string().trim().toLowerCase().min(1).max(250),
  category: z.string().min(1),
  imageUrl: z.array(z.string()),
});

const CreateProjectForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const MAX_IMAGE_COUNT = 5;

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      category: "",
      imageUrl: [],
    },
  });

  // TODO:
  const categories = [
    {id: "1", name: "Category 1", imageUrl: "https://placehold.co/600x400.png"},
    {id: "2", name: "Category 2", imageUrl: "https://placehold.co/600x400.png"},
    {id: "3", name: "Category 3", imageUrl: "https://placehold.co/600x400.png"},
  ];

  const onSubmit = async (values: z.infer<typeof createProjectSchema>) => {
    if (!files.length) return toast.error("Please add an image.");

    // TODO:
    console.log(values);

    setFiles([]);
    form.reset();
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
    <div className="container mx-auto space-y-4 rounded-md shadow-md p-5 bg-background dark:shadow-white/40 my-20">
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="mb-5 text-2xl font-bold">Create Project</h1>
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
            <FieldLabel htmlFor="projectImages">
              Select Project Images
            </FieldLabel>
            <div className="flex-1 text-base font-semibold text-gray-200 mt-3">
              <Input
                type="file"
                accept="image/*"
                placeholder="Add project images"
                className="cursor-pointer border-none bg-transparent outline-none file:text-blue-500"
                onChange={handleImageChange}
                id="projectImages"
                multiple
                // disabled={isUploading || createProject.isPending}
              />
            </div>
          </Field>
          <div className="flex flex-col gap-5 md:flex-row">
            <Controller
              control={form.control}
              name="title"
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Project Title</FieldLabel>
                  <Input
                    type="title"
                    placeholder="Enter project title"
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
            <Controller
              control={form.control}
              name="category"
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Project Category</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <Image
                            src={category.imageUrl}
                            alt="Category Image"
                            height={50}
                            width={50}
                            className="mr-4 inline-block h-5 w-5"
                          />
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <Controller
              control={form.control}
              name="description"
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Project Description
                  </FieldLabel>
                  <Textarea
                    placeholder="Enter your project description"
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
          </div>
          <Controller
            control={form.control}
            name="content"
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Project Content</FieldLabel>
                <Textarea
                  placeholder="Enter your project content"
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
            // disabled={isUploading || createProject.isPending}
            className="w-full"
          >
            <LoadingSwap
              isLoading={false}
              // isLoading={isUploading || createProject.isPending}
            >
              Create Project
            </LoadingSwap>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default CreateProjectForm;
