import Link from "next/link";
import {ArrowLeftIcon, UsersIcon} from "lucide-react";

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

const Users = () => {
  const users = {
    total: 100,
    users: [
      {
        id: "u1",
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "admin",
        banned: false,
        emailVerified: true,
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      {
        id: "u2",
        name: "Bob Smith",
        email: "bob@example.com",
        role: "admin",
        banned: false,
        emailVerified: true,
        createdAt: "2023-01-01T00:00:00.000Z",
      },
    ],
  };

  return (
    <div className="mx-auto container my-6 px-4">
      <Link href="/" className="inline-flex items-center mb-6">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Home
      </Link>
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
                  <UserRow key={user.id} user={user} selfId={user.id} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
