"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import QRCode from "react-qr-code";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {LoadingSwap} from "@/components/loading-swap";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";

const twoFactorAuthSchema = z.object({
  password: z.string().min(1),
});

type TwoFactorAuthFormType = z.infer<typeof twoFactorAuthSchema>;

type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

export function TwoFactorAuth({isEnabled}: {isEnabled: boolean}) {
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null
  );

  const router = useRouter();

  const form = useForm<TwoFactorAuthFormType>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: {
      password: "",
    },
  });

  const {isSubmitting} = form.formState;

  async function handleDisableTwoFactorAuth(data: TwoFactorAuthFormType) {
    await authClient.twoFactor.disable(
      {
        password: data.password,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to disable 2FA");
        },
        onSuccess: () => {
          form.reset();

          router.refresh();
        },
      }
    );
  }

  async function handleEnableTwoFactorAuth(data: TwoFactorAuthFormType) {
    const result = await authClient.twoFactor.enable({
      password: data.password,
    });

    if (result.error) {
      toast.error(result.error.message || "Failed to enable 2FA");
    }
    {
      setTwoFactorData(result.data);
      form.reset();
    }
  }

  if (twoFactorData != null) {
    return (
      <QRCodeVerify
        {...twoFactorData}
        onDone={() => {
          setTwoFactorData(null);
        }}
      />
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(
        isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth
      )}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="password"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                type="password"
                placeholder="Enter password"
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
          disabled={isSubmitting}
          className="w-full"
          variant={isEnabled ? "destructive" : "default"}
        >
          <LoadingSwap isLoading={isSubmitting}>
            {isEnabled ? "Disable 2FA" : "Enable 2FA"}
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
}

const qrSchema = z.object({
  token: z.string().length(6),
});

type QrFormType = z.infer<typeof qrSchema>;

function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & {onDone: () => void}) {
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);

  const router = useRouter();

  const form = useForm<QrFormType>({
    resolver: zodResolver(qrSchema),
    defaultValues: {
      token: "",
    },
  });

  const {isSubmitting} = form.formState;

  async function handleQrCode(data: QrFormType) {
    await authClient.twoFactor.verifyTotp(
      {
        code: data.token,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to verify code");
        },
        onSuccess: () => {
          setSuccessfullyEnabled(true);

          router.refresh();
        },
      }
    );
  }

  if (successfullyEnabled) {
    return (
      <>
        <p className="text-sm text-muted-foreground mb-2">
          Save these backup codes in a safe place. You can use them to access
          your account.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {backupCodes.map((code, index) => (
            <div key={index} className="font-mono text-sm">
              {code}
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={onDone}>
          Done
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Scan this QR code with your authenticator app and enter the code below:
      </p>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleQrCode)}>
        <FieldGroup>
          <Controller
            control={form.control}
            name="token"
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            <LoadingSwap isLoading={isSubmitting}>Submit Code</LoadingSwap>
          </Button>
        </FieldGroup>
      </form>
      <div className="p-4 bg-white w-fit">
        <QRCode size={256} value={totpURI} />
      </div>
    </div>
  );
}
