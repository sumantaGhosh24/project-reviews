"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {LoadingSwap} from "@/components/loading-swap";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
  revokeOtherSessions: z.boolean(),
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  });

  const {isSubmitting} = form.formState;

  async function handlePasswordChange(data: ChangePasswordForm) {
    await authClient.changePassword(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to change password");
      },
      onSuccess: () => {
        toast.success("Password changed successfully");
        form.reset();
      },
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(handlePasswordChange)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="currentPassword"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
              <Input
                type="password"
                placeholder="Enter current password"
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
          name="newPassword"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
              <Input
                type="password"
                placeholder="Enter current password"
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
          name="revokeOtherSessions"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel htmlFor={field.name}>
                  Log out other sessions
                </FieldLabel>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          <LoadingSwap isLoading={isSubmitting}>Change Password</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
}
