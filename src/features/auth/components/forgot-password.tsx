"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {LoadingSwap} from "@/components/loading-swap";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";

const forgotPasswordSchema = z.object({
  email: z.email().min(1),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword({openSignInTab}: {openSignInTab: () => void}) {
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {isSubmitting} = form.formState;

  async function handleForgotPassword(data: ForgotPasswordForm) {
    await authClient.requestPasswordReset(
      {
        ...data,
        redirectTo: "/reset-password",
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Failed to send password reset email"
          );
        },
        onSuccess: () => {
          toast.success("Password reset email sent");
        },
      }
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(handleForgotPassword)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                type="email"
                placeholder="Enter email"
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={openSignInTab}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            <LoadingSwap isLoading={isSubmitting}>Send Reset Email</LoadingSwap>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
