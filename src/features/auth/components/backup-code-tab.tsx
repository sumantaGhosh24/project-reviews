"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";

import {LoadingSwap} from "@/components/loading-swap";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";

const backupCodeSchema = z.object({
  code: z.string().min(1),
});

type BackupCodeForm = z.infer<typeof backupCodeSchema>;

export function BackupCodeTab() {
  const form = useForm<BackupCodeForm>({
    resolver: zodResolver(backupCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const {isSubmitting} = form.formState;

  // TODO:
  async function handleBackupCodeVerification(data: BackupCodeForm) {
    console.log(data);
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(handleBackupCodeVerification)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="code"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Backup Code</FieldLabel>
              <Input
                type="text"
                placeholder="Enter backup code"
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          <LoadingSwap isLoading={isSubmitting}>Verify</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
}
