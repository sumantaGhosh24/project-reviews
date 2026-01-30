"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import {type ChangeEvent, useState} from "react";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {useTheme} from "next-themes";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import rehypeSanitize from "rehype-sanitize";
import {toast} from "sonner";
import {XIcon} from "lucide-react";

import {useUploadThing} from "@/lib/uploadthing";
import {useSuspenseAllCategories} from "@/features/categories/hooks/use-categories";
import {LoadingSwap} from "@/components/loading-swap";
import {TagsInput} from "@/components/tags-input";
import {Input} from "@/components/ui/input";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent} from "@/components/ui/card";

import {useCreateProject} from "../hooks/use-projects";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {ssr: false}
);

const createProjectSchema = z.object({
  title: z.string().trim().toLowerCase().min(1).max(100),
  description: z.string().trim().toLowerCase().min(1).max(250),
  category: z.string().min(1),
  githubUrl: z.string().min(1),
  websiteUrl: z.string().min(1),
  imageUrl: z.array(z.string()),
});

type CreateProjectFormType = z.infer<typeof createProjectSchema>;

const CreateProjectForm = () => {
  const [content, setContent] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const MAX_IMAGE_COUNT = 5;

  const {startUpload, isUploading} = useUploadThing("imageUploader");

  const form = useForm<CreateProjectFormType>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      githubUrl: "",
      websiteUrl: "",
      imageUrl: [],
    },
  });

  const {theme} = useTheme();

  const router = useRouter();

  const {data: categories} = useSuspenseAllCategories();

  const createProject = useCreateProject();

  const onSubmit = async (values: CreateProjectFormType) => {
    if (content === undefined)
      return toast.error("Please add some data in content.");

    if (tags.length === 0) return toast.error("Please add minimum one tags.");

    if (!files.length) return toast.error("Please add an image.");

    const imgRes = await startUpload(files);
    if (!imgRes || !imgRes.length) {
      toast.error("Image upload failed.");
      return;
    }
    values.imageUrl = imgRes.map((img) => img.ufsUrl);

    createProject.mutate(
      {
        title: values.title,
        description: values.description,
        content: content,
        categoryId: values.category,
        tags: tags,
        githubUrl: values.githubUrl,
        websiteUrl: values.websiteUrl,
        imageUrl: values.imageUrl,
      },
      {
        onSuccess: (data) => {
          router.push(`/project/update/${data.id}`);

          form.reset();
          setTags([]);
          setFiles([]);
          setContent(undefined);
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
                disabled={isUploading || createProject.isPending}
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
          <div className="flex flex-col gap-5 md:flex-row">
            <Controller
              control={form.control}
              name="githubUrl"
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Project Github URL
                  </FieldLabel>
                  <Input
                    type="url"
                    placeholder="Enter project github url"
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
              name="websiteUrl"
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Project Website URL
                  </FieldLabel>
                  <Input
                    type="url"
                    placeholder="Enter project website url"
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
          <TagsInput
            value={tags}
            onChange={setTags}
            placeholder="Add project tags"
          />
          <div data-color-mode={theme}>
            <MDEditor
              value={content}
              onChange={setContent}
              previewOptions={{rehypePlugins: [[rehypeSanitize]]}}
              height={500}
            />
          </div>
          <Button
            type="submit"
            disabled={createProject.isPending || isUploading}
            className="w-full"
          >
            <LoadingSwap isLoading={createProject.isPending || isUploading}>
              Create Project
            </LoadingSwap>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default CreateProjectForm;
