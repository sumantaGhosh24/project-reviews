"use client";

import {useRouter} from "next/navigation";
import {UserXIcon} from "lucide-react";

import {authClient} from "@/lib/auth/auth-client";

import {AuthActionButton} from "./auth-action-button";

export function ImpersonationIndicator() {
  const router = useRouter();

  const {data: session, refetch} = authClient.useSession();

  if (session?.session.impersonatedBy == null) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AuthActionButton
        action={() =>
          authClient.admin.stopImpersonating(undefined, {
            onSuccess: () => {
              router.push("/users");
              refetch();
            },
          })
        }
        variant="destructive"
        size="sm"
      >
        <UserXIcon className="size-4" />
      </AuthActionButton>
    </div>
  );
}
