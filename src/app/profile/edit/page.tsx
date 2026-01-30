import {type ReactNode, Suspense} from "react";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import Link from "next/link";
import {
  ImageIcon,
  KeyIcon,
  LinkIcon,
  Loader2Icon,
  ShieldIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";

import {auth} from "@/lib/auth/auth";
import {polarClient} from "@/lib/polar";
import {requireAuth} from "@/features/auth/helpers/auth-utils";
import {ProfileUpdateForm} from "@/features/profile/components/profile-update-form";
import {ProfileUpdateImageForm} from "@/features/profile/components/profile-update-image-form";
import {AccountDeletion} from "@/features/profile/components/account-deletion";
import {AccountLinking} from "@/features/profile/components/account-linking";
import {SessionManagement} from "@/features/profile/components/session-management";
import {ChangePasswordForm} from "@/features/profile/components/change-password-form";
import {SetPasswordButton} from "@/features/profile/components/set-password-button";
import {TwoFactorAuth} from "@/features/profile/components/two-factor-auth";
import {PasskeyManagement} from "@/features/profile/components/passkey-management";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const metadata = {
  title: "Update Profile",
};

export default async function ProfilePage() {
  await requireAuth();

  const session = await auth.api.getSession({headers: await headers()});

  if (session == null) return redirect("/login");

  const customer = await polarClient.customers.getStateExternal({
    externalId: session.user.id,
  });

  const hasActiveSubscription =
    customer.activeSubscriptions && customer.activeSubscriptions.length > 0;

  return (
    <div className="container mx-auto my-6 px-4">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {session.user.image && (
            <Avatar className="size-24">
              <AvatarImage src={session.user.image} className="object-cover" />
              <AvatarFallback>
                {session.user?.name?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-1 items-center justify-between">
            <div className="">
              <h1 className="text-3xl font-bold capitalize">
                {session.user.name || "User Profile"}
              </h1>
              <p className="text-muted-foreground">{session.user.email}</p>
              <Badge className="uppercase">{session.user.role}</Badge>
              {hasActiveSubscription && (
                <Badge className="uppercase ml-2" variant="destructive">
                  vip user
                </Badge>
              )}
            </div>
            <Button asChild>
              <Link href={`/profile/${session.user.id}/details`}>
                View Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Tabs className="space-y-2" defaultValue="profile">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">
            <UserIcon />
            <span className="max-sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="image">
            <ImageIcon />
            <span className="max-sm:hidden">Image</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldIcon />
            <span className="max-sm:hidden">Security</span>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <KeyIcon />
            <span className="max-sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <LinkIcon />
            <span className="max-sm:hidden">Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <Trash2Icon />
            <span className="max-sm:hidden">Danger</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardContent>
              <ProfileUpdateForm user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="image">
          <Card>
            <CardContent>
              <ProfileUpdateImageForm image={session.user?.image} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <LoadingSuspense>
            <SecurityTab
              email={session.user.email}
              isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
            />
          </LoadingSuspense>
        </TabsContent>
        <TabsContent value="sessions">
          <LoadingSuspense>
            <SessionsTab currentSessionToken={session.session.token} />
          </LoadingSuspense>
        </TabsContent>
        <TabsContent value="accounts">
          <LoadingSuspense>
            <LinkedAccountsTab />
          </LoadingSuspense>
        </TabsContent>
        <TabsContent value="danger">
          <Card className="border border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountDeletion />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function LinkedAccountsTab() {
  const accounts = await auth.api.listUserAccounts({headers: await headers()});
  const nonCredentialAccounts = accounts.filter(
    (a) => a.providerId !== "credential"
  );

  return (
    <Card>
      <CardContent>
        <AccountLinking currentAccounts={nonCredentialAccounts} />
      </CardContent>
    </Card>
  );
}

async function SessionsTab({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) {
  const sessions = await auth.api.listSessions({headers: await headers()});

  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  );
}

async function SecurityTab({
  email,
  isTwoFactorEnabled,
}: {
  email: string;
  isTwoFactorEnabled: boolean;
}) {
  const [passkeys, accounts] = await Promise.all([
    auth.api.listPasskeys({headers: await headers()}),
    auth.api.listUserAccounts({headers: await headers()}),
  ]);

  const hasPasswordAccount = accounts.some(
    (a) => a.providerId === "credential"
  );

  return (
    <div className="space-y-6">
      {hasPasswordAccount ? (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password for improved security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>
              We will send you a password reset email to set up a password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetPasswordButton email={email} />
          </CardContent>
        </Card>
      )}
      {hasPasswordAccount && (
        <Card>
          <CardHeader className="flex items-center justify-between gap-2">
            <CardTitle>Two-Factor Authentication</CardTitle>
            <Badge variant={isTwoFactorEnabled ? "default" : "secondary"}>
              {isTwoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </CardHeader>
          <CardContent>
            <TwoFactorAuth isEnabled={isTwoFactorEnabled} />
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Passkeys</CardTitle>
        </CardHeader>
        <CardContent>
          <PasskeyManagement passkeys={passkeys} />
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSuspense({children}: {children: ReactNode}) {
  return (
    <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>
      {children}
    </Suspense>
  );
}
