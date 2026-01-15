"use client";

import Link from "next/link";
import {ChessKingIcon, Terminal} from "lucide-react";

import {authClient} from "@/lib/auth/auth-client";
import {useHasActiveSubscription} from "@/features/subscriptions/hooks/useSubscription";
import {ComponentWrapper} from "@/components/entity-components";
import {Button, buttonVariants} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

import SearchProject from "./search-project";
import FilterCategory from "./filter-category";
import HomeProjects from "./home-projects";

const ManageHomeProjects = () => {
  const {isLoading, hasActiveSubscription} = useHasActiveSubscription();

  const handleSubscribe = async () => {
    if (hasActiveSubscription) return;

    await authClient.checkout({
      products: ["e651f46d-ac20-4f26-b769-ad088b123df2"],
      slug: "pro",
    });
  };

  if (isLoading) {
    return <Skeleton className="w-full h-48" />;
  }

  return (
    <ComponentWrapper
      title="Public Projects"
      description="Projects publically available for everyone to view and use"
      button={
        hasActiveSubscription ? (
          <Link href="/project/create" className={buttonVariants()}>
            Create Project
          </Link>
        ) : (
          <Button onClick={handleSubscribe}>
            <span className="flex items-center gap-1.5">
              <ChessKingIcon /> Subscribe
            </span>
          </Button>
        )
      }
      search={<SearchProject />}
      filter={<FilterCategory />}
      table={
        <>
          {!hasActiveSubscription && (
            <Alert variant="default" className="mb-5">
              <Terminal />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You have to subscribe to create your own projects.
              </AlertDescription>
            </Alert>
          )}
          <HomeProjects />
        </>
      }
      className="my-5"
    />
  );
};

export default ManageHomeProjects;
