"use client";

import {AuthActionButton} from "@/features/auth/components/auth-action-button";

export function SetPasswordButton({email}: {email: string}) {
  return (
    <AuthActionButton
      variant="outline"
      successMessage="Password reset email sent"
      action={() => {
        // TODO:
        return Promise.resolve({error: {message: "Not implemented"}});
      }}
    >
      Send Password Reset Email
    </AuthActionButton>
  );
}
