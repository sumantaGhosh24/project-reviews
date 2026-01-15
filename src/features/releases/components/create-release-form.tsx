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

import {LoadingSwap} from "@/components/loading-swap";
import {Input} from "@/components/ui/input";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {useCreateRelease} from "../hooks/use-releases";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {ssr: false}
);

const createReleaseSchema = z.object({
  title: z.string().trim().toLowerCase().min(1).max(100),
  description: z.string().trim().toLowerCase().min(1).max(250),
});

interface CreateReleaseFormProps {
  projectId: string;
}

const CreateReleaseForm = ({projectId}: CreateReleaseFormProps) => {
  const [content, setContent] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof createReleaseSchema>>({
    resolver: zodResolver(createReleaseSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const {theme} = useTheme();

  const router = useRouter();

  const createRelease = useCreateRelease();

  const onSubmit = async (values: z.infer<typeof createReleaseSchema>) => {
    if (content === undefined)
      return toast.error("Please add some data in content.");

    createRelease.mutate(
      {
        projectId,
        title: values.title,
        description: values.description,
        content: content,
      },
      {
        onSuccess: (data) => {
          router.push(`/project/details/${data.id}/release/${data.id}`);

          form.reset();
          setContent(undefined);
        },
      }
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Create Release</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-1/2">
        <SheetHeader>
          <SheetTitle>Create Release</SheetTitle>
          <SheetDescription>
            Create a release version of this project and get user opinion.
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex flex-col justify-start gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Release Description
                  </FieldLabel>
                  <Textarea
                    placeholder="Enter your release description"
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
            <div data-color-mode={theme}>
              <MDEditor
                value={content}
                onChange={setContent}
                previewOptions={{rehypePlugins: [[rehypeSanitize]]}}
                height={500}
              />
            </div>
            <SheetFooter>
              <Button
                type="submit"
                disabled={createRelease.isPending}
                className="w-full"
              >
                <LoadingSwap isLoading={createRelease.isPending}>
                  Create Release
                </LoadingSwap>
              </Button>
              <SheetClose asChild>
                <Button variant="destructive">Close</Button>
              </SheetClose>
            </SheetFooter>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateReleaseForm;
