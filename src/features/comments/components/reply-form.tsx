"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {SendIcon} from "lucide-react";

import {authClient} from "@/lib/auth/auth-client";
import {LoadingSwap} from "@/components/loading-swap";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {Field, FieldError, FieldGroup} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";

import {useReplyComment} from "../hooks/use-comments";

const createReplySchema = z.object({
  body: z.string().trim().toLowerCase().min(1).max(500),
});

interface ReplyFormProps {
  commentId: string;
  releaseId: string;
}

export function ReplyForm({commentId, releaseId}: ReplyFormProps) {
  const {data: session, isPending} = authClient.useSession();

  const form = useForm<z.infer<typeof createReplySchema>>({
    resolver: zodResolver(createReplySchema),
    defaultValues: {
      body: "",
    },
  });

  const createReply = useReplyComment();

  const onSubmit = async (values: z.infer<typeof createReplySchema>) => {
    createReply.mutate(
      {
        body: values.body,
        commentId,
        releaseId,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  if (isPending) {
    return <Skeleton className="w-full h-40" />;
  }

  return (
    <div className="rounded-lg border bg-background p-2">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-row items-center gap-2">
          <Avatar className="max-w-fit size-10">
            <AvatarImage
              src={session?.user.image ?? "https://placehold.co/600x400.png"}
            />
            <AvatarFallback>
              {session?.user.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <Controller
            control={form.control}
            name="body"
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid} className="max-w-fill">
                <Textarea
                  placeholder="Enter your message..."
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
            disabled={createReply.isPending}
            className="max-w-fit"
          >
            <LoadingSwap isLoading={createReply.isPending}>
              <SendIcon />
            </LoadingSwap>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
