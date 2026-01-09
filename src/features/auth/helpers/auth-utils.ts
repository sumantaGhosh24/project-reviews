import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {auth} from "@/lib/auth/auth";
import {polarClient} from "@/lib/polar";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
};

export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/home");
  }
};

export const requireAdmin = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/home");
  }
};

export const requireSubscription = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const customer = await polarClient.customers.getStateExternal({
    externalId: session.user.id,
  });

  if (
    !customer.activeSubscriptions ||
    customer.activeSubscriptions.length === 0
  ) {
    redirect("/home");
  }
};
