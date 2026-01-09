"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

import {authClient} from "@/lib/auth/auth-client";
import {AuthActionButton} from "@/features/auth/components/auth-action-button";

export function PasskeyButton() {
  const router = useRouter();

  const {refetch} = authClient.useSession();

  useEffect(() => {
    authClient.signIn.passkey(
      {autoFill: true},
      {
        onSuccess() {
          refetch();
          router.push("/home");
        },
      }
    );
  }, [router, refetch]);

  return (
    <AuthActionButton
      variant="outline"
      className="w-full"
      action={() =>
        authClient.signIn.passkey(undefined, {
          onSuccess() {
            refetch();
            router.push("/home");
          },
        })
      }
    >
      Use Passkey
    </AuthActionButton>
  );
}
