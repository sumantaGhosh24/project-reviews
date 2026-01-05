"use client";

import Image from "next/image";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

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

interface UpdateProjectForm {
  id: string;
}

const updateProjectSchema = z.object({
  title: z.string().trim().toLowerCase().min(1).max(25),
  description: z.string().trim().toLowerCase().min(1).max(100),
  content: z.string().trim().toLowerCase().min(1).max(250),
  category: z.string().min(1),
});

const UpdateProjectForm = ({id}: UpdateProjectForm) => {
  // TODO:
  const project = {
    id: "1",
    title: "EcoTrack: AI Personal Carbon Footprint",
    category: "SaaS / AI",
    description:
      "A mobile app that uses computer vision to scan grocery receipts and calculate the carbon footprint of your shopping cart automatically.",
    author: "Sarah Drasner",
    content: "content",
    reviews: 24,
    upvotes: 142,
  };

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      content: project.content,
      category: project.category,
    },
  });

  // TODO:
  const categories = [
    {id: "1", name: "Category 1", imageUrl: "https://placehold.co/600x400.png"},
    {id: "2", name: "Category 2", imageUrl: "https://placehold.co/600x400.png"},
    {id: "3", name: "Category 3", imageUrl: "https://placehold.co/600x400.png"},
  ];

  const onSubmit = async (values: z.infer<typeof updateProjectSchema>) => {
    // TODO:
    console.log(values);
  };

  return (
    <div className="container mx-auto space-y-4 rounded-md shadow-md p-5 bg-background dark:shadow-white/40 my-20">
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="mb-5 text-2xl font-bold">Update Project</h1>
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
                          <Image
                            src={category.imageUrl}
                            alt="Category Image"
                            height={50}
                            width={50}
                            className="mb-2 mr-4 inline-block h-5 w-5"
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
            // disabled={updateProject.isPending}
            className="w-full"
          >
            <LoadingSwap
              isLoading={false}
              // isLoading={updateProject.isPending}
            >
              Update Project
            </LoadingSwap>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default UpdateProjectForm;
