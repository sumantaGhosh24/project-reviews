"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {Menu, X} from "lucide-react";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {Button} from "@/components/ui/button";

import {ModeToggle} from "./mode-toggle";

const Header = () => {
  const [open, setOpen] = useState(false);

  const {isLoading, isAuthenticated} = useKindeBrowserClient();

  return (
    <nav className="w-full border-b bg-blue-700 shadow shadow-black dark:shadow-white">
      <div className="mx-auto max-w-screen-xl items-center px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:block md:py-5">
          <Link href="/">
            <Image
              src="https://placehold.co/600x400.png"
              alt="logo"
              height={40}
              width={40}
              className="h-10 w-10 rounded"
            />
          </Link>
          <div className="md:hidden">
            <button
              className="rounded-md p-2 text-primary outline-none"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div
          className={`mt-8 flex-1 justify-end pb-3 md:mt-0 md:block md:pb-0 ${
            open ? "block" : "hidden"
          }`}
        >
          <NavigationMenu className="mx-auto">
            <NavigationMenuList className="flex-col gap-2 md:flex-row">
              {!isLoading && isAuthenticated ? (
                <>
                  {[
                    {id: 1, name: "Home", url: "/"},
                    {id: 2, name: "Load More", url: "/data/load"},
                    {id: 3, name: "Infinite Loading", url: "/data/infinite"},
                  ].map((item) => (
                    <NavigationMenuItem key={item.id}>
                      <Link href={item.url} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Manage</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {[
                            {
                              id: 1,
                              name: "Manage Categories",
                              url: "/categories",
                            },
                            {
                              id: 2,
                              name: "Manage Products",
                              url: "/products",
                            },
                          ].map((item) => (
                            <NavigationMenuItem key={item.id} className="my-3">
                              <Link href={item.url} legacyBehavior passHref>
                                <NavigationMenuLink
                                  className={navigationMenuTriggerStyle()}
                                >
                                  {item.name}
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                          ))}
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                  <Button
                    variant="secondary"
                    className={navigationMenuTriggerStyle()}
                    asChild
                  >
                    <LogoutLink>Logout</LogoutLink>
                  </Button>
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      <RegisterLink postLoginRedirectURL="/">
                        Register
                      </RegisterLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      <LoginLink postLoginRedirectURL="/">Login</LoginLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
              <ModeToggle />
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default Header;
