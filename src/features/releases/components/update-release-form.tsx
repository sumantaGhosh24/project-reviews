"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import dynamic from "next/dynamic";
import {useState} from "react";
import {useTheme} from "next-themes";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import rehypeSanitize from "rehype-sanitize";
import {toast} from "sonner";
import {BrainIcon} from "lucide-react";

import {LoadingSwap} from "@/components/loading-swap";
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
import {Release} from "@/generated/prisma/client";

import {useUpdateRelease} from "../hooks/use-releases";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {ssr: false}
);

const updateReleaseSchema = z.object({
  title: z.string().trim().toLowerCase().min(1).max(100),
  description: z.string().trim().toLowerCase().min(1).max(250),
  status: z.enum(["DRAFT", "DEVELOPMENT", "PRODUCTION", "DEPRECATED"]),
  visibility: z.enum(["PRIVATE", "PUBLIC", "UNLISTED"]),
});

type UpdateReleaseFormType = z.infer<typeof updateReleaseSchema>;

interface UpdateReleaseForm {
  release: Release;
}

const UpdateReleaseForm = ({release}: UpdateReleaseForm) => {
  const [content, setContent] = useState<string | undefined>(release?.content);
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateReleaseFormType>({
    resolver: zodResolver(updateReleaseSchema),
    defaultValues: {
      title: release?.title,
      description: release?.description,
      status: release?.status ?? "DRAFT",
      visibility: release?.visibility ?? "PRIVATE",
    },
  });

  const {theme} = useTheme();

  const generateContent = async () => {
    setLoading(true);

    try {
      const title = form.getValues("title");
      const description = form.getValues("description");

      const res = await fetch("/api/generate-release-markdown", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await res.json();
      setContent(data.markdown);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const updateRelease = useUpdateRelease();

  const onSubmit = async (values: UpdateReleaseFormType) => {
    if (content === undefined)
      return toast.error("Please add some data in content.");

    updateRelease.mutate({
      id: release?.id as string,
      projectId: release?.projectId as string,
      title: values.title,
      description: values.description,
      content: content,
      status: values.status,
      visibility: values.visibility,
    });
  };

  return (
    <form
      className="flex flex-col justify-start gap-10"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl font-bold">Update Release</h1>
      <FieldGroup className="p-3">
        <Controller
          control={form.control}
          name="title"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Release Title</FieldLabel>
              <Input
                type="title"
                placeholder="Enter release title"
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Release Description</FieldLabel>
              <Textarea
                placeholder="Enter your release description"
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex flex-col gap-5 md:flex-row">
          <Controller
            control={form.control}
            name="status"
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Release Status</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select release status" />
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
                <FieldLabel htmlFor={field.name}>Release Visibility</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select release visibility" />
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
        <Button
          onClick={generateContent}
          disabled={loading || updateRelease.isPending}
        >
          <BrainIcon className="h-4 w-4" />
          {loading ? "Generating..." : "Update Content Using AI"}
        </Button>
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
          disabled={updateRelease.isPending || loading}
          className="w-full"
        >
          <LoadingSwap isLoading={updateRelease.isPending}>
            Update Release
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};

export default UpdateReleaseForm;
