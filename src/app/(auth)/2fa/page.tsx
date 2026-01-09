import {redirect} from "next/navigation";
import {headers} from "next/headers";

import {auth} from "@/lib/auth/auth";
import {requireUnauth} from "@/features/auth/helpers/auth-utils";
import {TotpForm} from "@/features/auth/components/totp-form";
import {BackupCodeTab} from "@/features/auth/components/backup-code-tab";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export const metadata = {
  title: "Two-Factor Authentication",
};

export default async function TwoFactorPage() {
  await requireUnauth();

  const session = await auth.api.getSession({headers: await headers()});
  if (session != null) return redirect("/home");

  return (
    <div className="my-6 px-4">
      <Card className="container mx-auto w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="totp">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="totp">Authenticator</TabsTrigger>
              <TabsTrigger value="backup">Backup Code</TabsTrigger>
            </TabsList>
            <TabsContent value="totp">
              <TotpForm />
            </TabsContent>
            <TabsContent value="backup">
              <BackupCodeTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
