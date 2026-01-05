"use client";

import {MoreHorizontalIcon} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {TableCell, TableRow} from "@/components/ui/table";

interface UserRowProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    banned: boolean;
    emailVerified: boolean;
    createdAt: string;
  };
  selfId: string;
}

export function UserRow({user, selfId}: UserRowProps) {
  const isSelf = user.id === selfId;

  function handleImpersonateUser(userId: string) {
    return Promise.resolve({error: {message: "Not implemented"}});
  }

  function handleBanUser(userId: string) {
    return Promise.resolve({error: {message: "Not implemented"}});
  }

  function handleUnbanUser(userId: string) {
    return Promise.resolve({error: {message: "Not implemented"}});
  }

  function handleRevokeSessions(userId: string) {
    return Promise.resolve({error: {message: "Not implemented"}});
  }

  function handleRemoveUser(userId: string) {
    return Promise.resolve({error: {message: "Not implemented"}});
  }

  return (
    <TableRow key={user.id}>
      <TableCell>
        <div>
          <div className="font-medium">{user.name || "No name"}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="flex items-center gap-2 not-empty:mt-2">
            {user.banned && <Badge variant="destructive">Banned</Badge>}
            {!user.emailVerified && <Badge variant="outline">Unverified</Badge>}
            {isSelf && <Badge>You</Badge>}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        {!isSelf && (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleImpersonateUser(user.id)}
                >
                  Impersonate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRevokeSessions(user.id)}>
                  Revoke Sessions
                </DropdownMenuItem>
                {user.banned ? (
                  <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                    Unban User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                    Ban User
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem variant="destructive">
                    Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleRemoveUser(user.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  );
}
