"use client";

import {authClient} from "@/lib/auth/auth-client";
import {AuthActionButton} from "@/features/auth/components/auth-action-button";

export function AccountDeletion() {
  return (
    <AuthActionButton
      requireAreYouSure
      variant="destructive"
      className="w-full"
      successMessage="Account deletion initiated. Please check your email to confirm."
      action={() => authClient.deleteUser({callbackURL: "/"})}
    >
      Delete Account Permanently
    </AuthActionButton>
  );
}
