"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import dynamic from "next/dynamic";
import {ChangeEvent, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {useTheme} from "next-themes";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import rehypeSanitize from "rehype-sanitize";
import {toast} from "sonner";
import {ArrowLeftIcon, BrainIcon, XIcon} from "lucide-react";

import {useUploadThing} from "@/lib/uploadthing";
import {LoadingSwap} from "@/components/loading-swap";
import {Input} from "@/components/ui/input";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent} from "@/components/ui/card";

import {useCreateRelease} from "../hooks/use-releases";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {ssr: false}
);

const createReleaseSchema = z.object({
  title: z.string().trim().toLowerCase().min(1).max(100),
  description: z.string().trim().toLowerCase().min(1).max(250),
  imageUrl: z.array(z.string()),
});

type CreateReleaseFormType = z.infer<typeof createReleaseSchema>;

interface CreateReleaseFormProps {
  projectId: string;
}

const CreateReleaseForm = ({projectId}: CreateReleaseFormProps) => {
  const [content, setContent] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const MAX_IMAGE_COUNT = 5;

  const {startUpload, isUploading} = useUploadThing("imageUploader");

  const form = useForm<CreateReleaseFormType>({
    resolver: zodResolver(createReleaseSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: [],
    },
  });

  const {theme} = useTheme();

  const router = useRouter();

  const generateContent = async () => {
    setLoading(true);

    try {
      const title = form.getValues("title");
      const description = form.getValues("description");

      if (title.length === 0 || description.length === 0) return;

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

  const createRelease = useCreateRelease();

  const onSubmit = async (values: CreateReleaseFormType) => {
    if (content === undefined)
      return toast.error("Please add some data in content.");

    if (!files.length) return toast.error("Please add an image.");

    const imgRes = await startUpload(files);
    if (!imgRes || !imgRes.length) {
      toast.error("Image upload failed.");
      return;
    }
    values.imageUrl = imgRes.map((img) => img.ufsUrl);

    createRelease.mutate(
      {
        projectId,
        title: values.title,
        description: values.description,
        content: content,
        imageUrl: values.imageUrl,
      },
      {
        onSuccess: (data) => {
          router.push(`/project/details/${data.id}/release/${data.id}/update`);

          form.reset();
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
    <form
      className="flex flex-col justify-start gap-10"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex items-center justify-between">
        <h1 className="mb-5 text-2xl font-bold">Create Release</h1>
        <Button asChild>
          <Link href={`/project/details/${projectId}`}>
            <ArrowLeftIcon className="h-4 w-4" /> Back to Project
          </Link>
        </Button>
      </div>
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
              disabled={isUploading || createRelease.isPending}
            />
          </div>
        </Field>
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
        <Button
          onClick={generateContent}
          disabled={loading || createRelease.isPending || isUploading}
        >
          <BrainIcon className="h-4 w-4" />
          {loading ? "Generating..." : "Generate Content Using AI"}
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
          disabled={createRelease.isPending || isUploading || loading}
          className="w-full"
        >
          <LoadingSwap isLoading={createRelease.isPending || isUploading}>
            Create Release
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};

export default CreateReleaseForm;
