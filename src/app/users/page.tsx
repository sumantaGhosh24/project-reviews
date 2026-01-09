import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {UsersIcon} from "lucide-react";

import {auth} from "@/lib/auth/auth";
import {requireAdmin} from "@/features/auth/helpers/auth-utils";
import {UserRow} from "@/features/users/components/user-row";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "Manage Users",
};

const ManageUsers = async () => {
  await requireAdmin();

  const session = await auth.api.getSession({headers: await headers()});

  if (session == null) return redirect("/login");

  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: {permission: {user: ["list"]}},
  });

  if (!hasAccess.success) return redirect("/home");

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: {limit: 100, sortBy: "createdAt", sortDirection: "desc"},
  });

  return (
    <div className="mx-auto container my-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Users ({users.total})
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.users.map((user) => (
                  <UserRow key={user.id} user={user} selfId={session.user.id} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
