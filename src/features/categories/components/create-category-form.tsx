"use client";

import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {LoadingSwap} from "@/components/loading-swap";
import {Input} from "@/components/ui/input";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";

import {useCreateCategory} from "../hooks/use-categories";

const createCategorySchema = z.object({
  name: z.string().min(1),
});

type CreateCategoryForm = z.infer<typeof createCategorySchema>;

const CreateCategoryForm = () => {
  const form = useForm<CreateCategoryForm>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const createCategory = useCreateCategory();

  const onSubmit = async (values: CreateCategoryForm) => {
    createCategory.mutate(
      {name: values.name},
      {
        onSettled: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <form
      className="flex flex-col justify-start gap-10"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h1 className="mb-5 text-2xl font-bold">Create Category</h1>
      <FieldGroup>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          disabled={createCategory.isPending}
          className="w-full"
        >
          <LoadingSwap isLoading={createCategory.isPending}>
            Create Category
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};

export default CreateCategoryForm;
