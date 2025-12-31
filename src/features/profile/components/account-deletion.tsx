"use client";

import {AuthActionButton} from "@/features/auth/components/auth-action-button";

export function AccountDeletion() {
  return (
    <AuthActionButton
      requireAreYouSure
      variant="destructive"
      className="w-full"
      successMessage="Account deletion initiated. Please check your email to confirm."
      // TODO:
      action={() => {
        return Promise.resolve({error: {message: "Not implemented"}});
      }}
    >
      Delete Account Permanently
    </AuthActionButton>
  );
}
