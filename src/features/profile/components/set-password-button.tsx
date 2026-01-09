"use client";

import {authClient} from "@/lib/auth/auth-client";
import {AuthActionButton} from "@/features/auth/components/auth-action-button";

export function SetPasswordButton({email}: {email: string}) {
  return (
    <AuthActionButton
      variant="outline"
      successMessage="Password reset email sent"
      action={() => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: "/reset-password",
        });
      }}
    >
      Send Password Reset Email
    </AuthActionButton>
  );
}
