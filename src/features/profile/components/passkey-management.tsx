"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {toast} from "sonner";
import {Passkey} from "@better-auth/passkey";
import {Trash2Icon} from "lucide-react";

import {authClient} from "@/lib/auth/auth-client";
import {AuthActionButton} from "@/features/auth/components/auth-action-button";
import {LoadingSwap} from "@/components/loading-swap";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";

const passkeySchema = z.object({
  name: z.string().min(1),
});

type PasskeyFormType = z.infer<typeof passkeySchema>;

export function PasskeyManagement({passkeys}: {passkeys: Passkey[]}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const form = useForm<PasskeyFormType>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: "",
    },
  });

  const {isSubmitting} = form.formState;

  async function handleAddPasskey(data: PasskeyFormType) {
    await authClient.passkey.addPasskey(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to add passkey");
      },
      onSuccess: () => {
        router.refresh();
        setIsDialogOpen(false);
      },
    });
  }

  function handleDeletePasskey(passkeyId: string) {
    return authClient.passkey.deletePasskey(
      {id: passkeyId},
      {onSuccess: () => router.refresh()}
    );
  }

  return (
    <div className="space-y-6">
      {passkeys.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No passkeys yet</CardTitle>
            <CardDescription>
              Add your first passkey for secure, passwordless authentication.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {passkeys.map((passkey) => (
            <Card key={passkey.id}>
              <CardHeader className="flex gap-2 items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{passkey.name}</CardTitle>
                  <CardDescription>
                    Created {new Date(passkey.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <AuthActionButton
                  requireAreYouSure
                  variant="destructive"
                  size="icon"
                  action={() => handleDeletePasskey(passkey.id)}
                >
                  <Trash2Icon />
                </AuthActionButton>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(o) => {
          if (o) form.reset();
          setIsDialogOpen(o);
        }}
      >
        <DialogTrigger asChild>
          <Button>New Passkey</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Passkey</DialogTitle>
            <DialogDescription>
              Create a new passkey for secure, passwordless authentication.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleAddPasskey)}
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      type="ntextame"
                      placeholder="Enter name"
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
                <LoadingSwap isLoading={isSubmitting}>Add</LoadingSwap>
              </Button>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
