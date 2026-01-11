"use client";

import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Input} from "@/components/ui/input";
import {LoadingSwap} from "@/components/loading-swap";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";

import {useSuspenseCategory, useUpdateCategory} from "../hooks/use-categories";

interface UpdateCategoryFormProps {
  id: string;
}

const updateCategorySchema = z.object({
  name: z.string().min(1),
});

type UpdateCategoryForm = z.infer<typeof updateCategorySchema>;

const UpdateCategoryForm = ({id}: UpdateCategoryFormProps) => {
  const {data: category} = useSuspenseCategory(id);

  const form = useForm<UpdateCategoryForm>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category?.name,
    },
  });

  const updateCategory = useUpdateCategory();

  const onSubmit = async (values: UpdateCategoryForm) => {
    updateCategory.mutate({id: category?.id as string, name: values.name});
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
            disabled={updateCategory.isPending}
            className="w-full"
          >
            <LoadingSwap isLoading={updateCategory.isPending}>
              Update Category
            </LoadingSwap>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default UpdateCategoryForm;
