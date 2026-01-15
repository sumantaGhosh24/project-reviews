"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import dynamic from "next/dynamic";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useTheme} from "next-themes";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import rehypeSanitize from "rehype-sanitize";
import {toast} from "sonner";

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

import {useSuspenseProject, useUpdateProject} from "../hooks/use-projects";

interface UpdateProjectForm {
  id: string;
}

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {ssr: false}
);

const updateProjectSchema = z.object({
  title: z.string().trim().toLowerCase().min(1).max(100),
  description: z.string().trim().toLowerCase().min(1).max(250),
  category: z.string().min(1),
  githubUrl: z.string().min(1),
  websiteUrl: z.string().min(1),
  status: z.enum(["DRAFT", "DEVELOPMENT", "PRODUCTION", "DEPRECATED"]),
  visibility: z.enum(["PRIVATE", "PUBLIC", "UNLISTED"]),
});

const UpdateProjectForm = ({id}: UpdateProjectForm) => {
  const {data: project} = useSuspenseProject(id);

  const [content, setContent] = useState<string | undefined>(project?.content);
  const [tags, setTags] = useState<string[]>(project?.tags || []);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      title: project?.title,
      description: project?.description,
      category: project?.categoryId ?? "",
      githubUrl: project?.githubUrl ?? "",
      websiteUrl: project?.websiteUrl ?? "",
      status: project?.status ?? "DRAFT",
      visibility: project?.visibility ?? "PRIVATE",
    },
  });

  const {theme} = useTheme();

  const router = useRouter();

  const {data: categories} = useSuspenseAllCategories();

  const updateProject = useUpdateProject();

  const onSubmit = async (values: z.infer<typeof updateProjectSchema>) => {
    if (content === undefined)
      return toast.error("Please add some data in content.");

    if (tags.length === 0) return toast.error("Please add minimum one tags.");

    updateProject.mutate({
      id: project?.id as string,
      title: values.title,
      description: values.description,
      content: content,
      categoryId: values.category,
      tags: tags,
      githubUrl: values.githubUrl,
      websiteUrl: values.websiteUrl,
      status: values.status,
      visibility: values.visibility,
    });
  };

  return (
    <div className="container mx-auto space-y-4 rounded-md shadow-md p-5 bg-background dark:shadow-white/40 my-20">
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between">
          <h1 className="mb-5 text-2xl font-bold">Update Project</h1>
          <Button
            onClick={() => router.push(`/project/details/${project?.id}`)}
            variant="success"
          >
            View Project
          </Button>
        </div>
        <FieldGroup>
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
          <div className="flex flex-col gap-5 md:flex-row">
            <Controller
              control={form.control}
              name="status"
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Project Status</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["DRAFT", "DEVELOPMENT", "PRODUCTION", "DEPRECATED"].map(
                        (s, ind) => (
                          <SelectItem key={`${s}-${ind}`} value={s}>
                            {s}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="visibility"
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Project Visibility
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      {["PRIVATE", "PUBLIC"].map((s, ind) => (
                        <SelectItem key={`${s}-${ind}`} value={s}>
                          {s}
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
            disabled={updateProject.isPending}
            className="w-full"
          >
            <LoadingSwap isLoading={updateProject.isPending}>
              Update Project
            </LoadingSwap>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default UpdateProjectForm;
