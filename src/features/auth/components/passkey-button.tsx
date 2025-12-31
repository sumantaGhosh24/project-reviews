"use client";

import {AuthActionButton} from "@/features/auth/components/auth-action-button";

export function PasskeyButton() {
  // TODO:
  return (
    <AuthActionButton
      variant="outline"
      className="w-full"
      action={() => {
        return Promise.resolve({error: {message: "Not implemented"}});
      }}
    >
      Use Passkey
    </AuthActionButton>
  );
}
