"use client";

import Link from "next/link";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";

import {Button} from "@/components/ui/button";

export default function LoginPage() {
  const {isAuthenticated, isLoading} = useKindeBrowserClient();

  if (!isLoading && isAuthenticated) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <div className="min-w-[60%] h-[400px] rounded-lg p-5 shadow-lg shadow-black dark:shadow-white flex items-center justify-center gap-5 flex-col">
          <h2 className="text-2xl font-bold">You are already logged in</h2>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link href="/">Go to Home Page</Link>
            </Button>
            <Button asChild>
              <LogoutLink>Logout</LogoutLink>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="min-w-[60%] h-[400px] rounded-lg p-5 shadow-lg shadow-black dark:shadow-white flex items-center justify-center gap-5 flex-col">
        <h2 className="text-2xl font-bold">Login/Register User</h2>
        <div className="flex items-center gap-3">
          <Button asChild className="bg-blue-700 hover:bg-blue-800">
            <LoginLink postLoginRedirectURL="/">Login</LoginLink>
          </Button>
          <Button asChild className="bg-blue-700 hover:bg-blue-800">
            <RegisterLink postLoginRedirectURL="/">Register</RegisterLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
