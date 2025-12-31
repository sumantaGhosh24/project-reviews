"use client";

import {PlusIcon, Trash2Icon} from "lucide-react";

import {AuthActionButton} from "@/features/auth/components/auth-action-button";
import {Card, CardContent} from "@/components/ui/card";

// TODO:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Account = any;

export function AccountLinking({
  currentAccounts,
}: {
  currentAccounts: Account[];
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Linked Accounts</h3>
        {currentAccounts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-secondary-muted">
              No linked accounts found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {currentAccounts.map((account) => (
              <AccountCard
                key={account.id}
                provider={account.providerId}
                account={account}
              />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Link Other Accounts</h3>
        <div className="grid gap-3">{/* TODO: */}</div>
      </div>
    </div>
  );
}

function AccountCard({
  provider,
  account,
}: {
  provider: string;
  account?: Account;
}) {
  // TODO:
  function linkAccount() {
    return Promise.resolve({error: {message: "Not implemented"}});
  }

  // TODO:
  function unlinkAccount() {
    if (account == null) {
      return Promise.resolve({error: {message: "Account not found"}});
    }
    return Promise.resolve({error: {message: "Not implemented"}});
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">{/* TODO: */}</div>
          {account == null ? (
            <AuthActionButton variant="outline" size="sm" action={linkAccount}>
              <PlusIcon />
              Link
            </AuthActionButton>
          ) : (
            <AuthActionButton
              variant="destructive"
              size="sm"
              action={unlinkAccount}
            >
              <Trash2Icon />
              Unlink
            </AuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
