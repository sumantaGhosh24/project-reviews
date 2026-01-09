"use client";

import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {LoadingSwap} from "@/components/loading-swap";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";

const totpSchema = z.object({
  code: z.string().length(6),
});

type TotpForm = z.infer<typeof totpSchema>;

export function TotpForm() {
  const router = useRouter();

  const form = useForm<TotpForm>({
    resolver: zodResolver(totpSchema),
    defaultValues: {
      code: "",
    },
  });

  const {isSubmitting} = form.formState;

  async function handleTotpVerification(data: TotpForm) {
    await authClient.twoFactor.verifyTotp(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to verify code");
      },
      onSuccess: () => {
        router.push("/home");
      },
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(handleTotpVerification)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="code"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Code</FieldLabel>
              <Input
                type="text"
                placeholder="Enter code"
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
