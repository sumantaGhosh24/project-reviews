"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";

import {LoadingSwap} from "@/components/loading-swap";
import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {useCreateReview} from "../hooks/use-reviews";

const createReviewSchema = z.object({
  rating: z.string(),
  feedback: z.string().trim().toLowerCase().min(1).max(500),
});

type CreateReviewFormType = z.infer<typeof createReviewSchema>;

interface CreateReviewFormProps {
  releaseId: string;
}

export function CreateReviewForm({releaseId}: CreateReviewFormProps) {
  const form = useForm<CreateReviewFormType>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: "1",
      feedback: "",
    },
  });

  const createReview = useCreateReview();

  const onSubmit = async (values: CreateReviewFormType) => {
    createReview.mutate(
      {
        rating: parseInt(values.rating),
        feedback: values.feedback,
        releaseId,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <div className="rounded-lg border bg-background p-2">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="p-3">
          <Controller
            control={form.control}
            name="rating"
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Review Rating</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((s, ind) => (
                      <SelectItem key={`${s}-${ind}`} value={s.toString()}>
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
          <Controller
            control={form.control}
            name="feedback"
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Review Feedback</FieldLabel>
                <Textarea
                  placeholder="Enter your feedback..."
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
          <Button type="submit" disabled={createReview.isPending}>
            <LoadingSwap isLoading={createReview.isPending}>
              Post Review
            </LoadingSwap>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
