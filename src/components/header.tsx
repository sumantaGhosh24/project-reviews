"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import {ChessKingIcon, MenuIcon, XIcon} from "lucide-react";

import {adminLinks, guestLinks, premiumLinks, userLinks} from "@/constants";
import {authClient} from "@/lib/auth/auth-client";
import {useHasActiveSubscription} from "@/features/subscriptions/hooks/useSubscription";

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
import {Button} from "./ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {Skeleton} from "./ui/skeleton";

const Header = () => {
  const [open, setOpen] = useState(false);

  const [hasAdminPermission, setHasAdminPermission] = useState(false);

  const router = useRouter();

  const {data: session, isPending: loading} = authClient.useSession();

  useEffect(() => {
    authClient.admin
      .hasPermission({permission: {category: ["create"]}})
      .then(({data}) => {
        setHasAdminPermission(data?.success ?? false);
      });
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You logged out successfully!");

          router.push("/login");
        },
      },
    });
  };

  const {isLoading, hasActiveSubscription} = useHasActiveSubscription();

  const handleSubscribe = async () => {
    if (hasActiveSubscription) return;

    await authClient.checkout({
      products: ["e651f46d-ac20-4f26-b769-ad088b123df2"],
      slug: "pro",
    });
  };

  const handleSubscriptionPortal = async () => {
    if (!hasActiveSubscription) return;

    await authClient.customer.portal();
  };

  if (loading || isLoading) {
    return <Skeleton className="w-full h-20" />;
  }

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
              {session !== null ? (
                <>
                  {hasAdminPermission && (
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
                  {hasActiveSubscription ? (
                    <Button
                      type="button"
                      className={navigationMenuTriggerStyle({
                        className: "text-black dark:text-white",
                      })}
                      onClick={handleSubscriptionPortal}
                    >
                      Manage Subscription
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        className={navigationMenuTriggerStyle({
                          className: "text-black dark:text-white",
                        })}
                        onClick={handleSubscribe}
                      >
                        <span className="flex items-center gap-1.5">
                          <ChessKingIcon /> Subscribe
                        </span>
                      </Button>
                      {premiumLinks.map((item) => (
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
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href={"/profile/edit"}>
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
                    onClick={handleSignOut}
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
