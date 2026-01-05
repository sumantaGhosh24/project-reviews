"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {MenuIcon, XIcon} from "lucide-react";

import {adminLinks, guestLinks, premiumLinks, userLinks} from "@/constants";

import {ModeToggle} from "./mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {Button} from "./ui/button";

const Header = () => {
  const [open, setOpen] = useState(false);

  // TODO:
  const isAuthenticated = true;
  const isAdmin = true;
  const isPremium = true;
  const userId = "1";

  const handleLogout = () => {
    console.log("logout");
  };

  return (
    <nav className="w-full border-b bg-primary">
      <div className="mx-auto max-w-screen-xl items-center px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:block md:py-5">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="logo"
              height={20}
              width={20}
              className="h-10 w-10 rounded"
            />
          </Link>
          <div className="md:hidden">
            <button
              className="rounded-md p-2 text-primary outline-none"
              onClick={() => setOpen(!open)}
            >
              {open ? <XIcon color="white" /> : <MenuIcon color="white" />}
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
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Manage</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[200px] gap-4">
                            <li>
                              {adminLinks.map((item) => (
                                <NavigationMenuLink key={item.id} asChild>
                                  <Link href={item.url}>{item.name}</Link>
                                </NavigationMenuLink>
                              ))}
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </>
                  )}
                  {userLinks.map((item) => (
                    <NavigationMenuItem key={item.id}>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href={item.url}>{item.name}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                  {isPremium &&
                    premiumLinks.map((item) => (
                      <NavigationMenuItem key={item.id}>
                        <NavigationMenuLink
                          asChild
                          className={navigationMenuTriggerStyle()}
                        >
                          <Link href={item.url}>{item.name}</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href={`/profile/${userId}`}>
                        <Avatar>
                          <AvatarImage src="https://placehold.co/600x400.png" />
                          <AvatarFallback>
                            {"User".substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <Button
                    variant="secondary"
                    className={navigationMenuTriggerStyle()}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  {guestLinks.map((item) => (
                    <NavigationMenuItem key={item.id}>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href={item.url}>{item.name}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
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
