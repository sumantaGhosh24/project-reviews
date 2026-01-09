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

const profileUpdateSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  favoriteNumber: z
    .string()
    .min(1)
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num);
    }, "Favorite number must be a number"),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export function ProfileUpdateForm({
  user,
}: {
  user: {
    email: string;
    name: string;
    favoriteNumber: number;
  };
}) {
  const router = useRouter();

  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      email: user.email,
      name: user.name,
      favoriteNumber: user.favoriteNumber.toString(),
    },
  });

  const {isSubmitting} = form.formState;

  async function handleProfileUpdate(data: ProfileUpdateForm) {
    const promises = [
      authClient.updateUser({
        name: data.name,
        favoriteNumber: Number(data.favoriteNumber),
      }),
    ];

    if (data.email !== user.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: data.email,
          callbackURL: "/profile/edit",
        })
      );
    }

    const res = await Promise.all(promises);

    const updateUserResult = res[0];
    const emailResult = res[1] ?? {error: false};

    if (updateUserResult.error) {
      toast.error(updateUserResult.error.message || "Failed to update profile");
    } else if (emailResult.error) {
      toast.error(emailResult.error.message || "Failed to change email");
    } else {
      if (data.email !== user.email) {
        toast.success("Verify your new email address to complete the change.");
      } else {
        toast.success("Profile updated successfully");
      }
      router.refresh();
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(handleProfileUpdate)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                type="text"
                placeholder="Enter name"
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
          name="email"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                type="text"
                placeholder="Enter email"
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
          name="favoriteNumber"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Favorite Number</FieldLabel>
              <Input
                type="text"
                placeholder="Enter favorite number"
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          <LoadingSwap isLoading={isSubmitting}>Update Profile</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
}
