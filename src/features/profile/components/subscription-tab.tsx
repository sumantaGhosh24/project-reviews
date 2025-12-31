"use client";

import {ChessKingIcon} from "lucide-react";

import {Button} from "@/components/ui/button";

// TODO:
const SubscriptionTab = () => {
  const hasActiveSubscription = false;

  const handleSubscribe = async () => {
    // TODO:
  };

  const handleSubscriptionPortal = async () => {
    // TODO:
  };

  return (
    <div>
      {hasActiveSubscription ? (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            You have an active subscription.
          </p>
          <Button type="button" onClick={handleSubscriptionPortal}>
            Manage Subscription
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            You don&apos;t have an active subscription.
          </p>
          <p className="text-sm text-muted-foreground">
            You can subscribe to a plan to unlock premium features.
          </p>
          <br />
          <Button type="button" onClick={handleSubscribe}>
            <span className="flex items-center gap-1.5">
              <ChessKingIcon /> Subscribe
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTab;
