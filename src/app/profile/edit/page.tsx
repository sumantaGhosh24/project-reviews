import {type ReactNode, Suspense} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ChessKingIcon,
  KeyIcon,
  LinkIcon,
  Loader2Icon,
  ShieldIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";

import {ProfileUpdateForm} from "@/features/profile/components/profile-update-form";
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
import SubscriptionTab from "@/features/profile/components/subscription-tab";

const EditProfile = () => {
  // TODO:
  const session = {
    user: {
      image: "https://placehold.co/600x400.png",
      name: "Alice Johnson",
      role: "admin",
      email: "alice@example.com",
      favoriteNumber: 123456,
      twoFactorEnabled: true,
    },
    session: {
      token: "something",
    },
  };

  return (
    <div className="container mx-auto my-6 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center mb-6">
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Home
        </Link>
        <div className="flex items-center space-x-4">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {session.user.image ? (
              <Image
                width={64}
                height={64}
                src={session.user.image}
                alt="User Avatar"
                className="object-cover"
              />
            ) : (
              <UserIcon className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-1 justify-between items-center">
              <h1 className="text-3xl font-bold capitalize">
                {session.user.name || "User Profile"}
              </h1>
              <div className="flex items-center gap-2">
                <Badge className="uppercase">{session.user.role}</Badge>
                <Badge className="uppercase bg-orange-600">vip</Badge>
              </div>
            </div>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>
      <Tabs className="space-y-2" defaultValue="profile">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">
            <UserIcon />
            <span className="max-sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <ChessKingIcon />
            <span className="max-sm:hidden">Subscription</span>
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
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionTab />
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
};

async function LinkedAccountsTab() {
  // TODO:

  return (
    <Card>
      <CardContent>
        {/* <AccountLinking currentAccounts={nonCredentialAccounts} /> */}
      </CardContent>
    </Card>
  );
}

async function SessionsTab({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) {
  // TODO:

  return (
    <Card>
      <CardContent>
        {/* <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        /> */}
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
  // TODO:

  return (
    <div className="space-y-6">
      {/* {hasPasswordAccount ? (
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
      )} */}
      <Card>
        <CardHeader>
          <CardTitle>Passkeys</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <PasskeyManagement passkeys={passkeys} /> */}
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

export default EditProfile;
