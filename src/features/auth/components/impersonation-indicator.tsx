"use client";

import {UserXIcon} from "lucide-react";

import {AuthActionButton} from "./auth-action-button";

export function ImpersonationIndicator() {
  // TODO:

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AuthActionButton
        action={() => {
          return Promise.resolve({error: {message: "Not implemented"}});
        }}
        variant="destructive"
        size="sm"
      >
        <UserXIcon className="size-4" />
      </AuthActionButton>
    </div>
  );
}
