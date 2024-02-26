"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const proModal = useProModal(); // use the useProModal hook to show the pro modal

  // use the useAction hook to pass the stripeRedirect action and handle the success and error events
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data; // redirect to the stripe checkout page
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  /**
   * Handles the button click event.
   * If the user is already subscribed to the Pro plan, it executes the action.
   * Otherwise, it opens the Pro modal.
   */
  const onClick = () => {
    if (isPro) {
      execute({});
    } else {
      proModal.onOpen();
    }
  };

  return (
    <Button variant="primary" disabled={isLoading} onClick={onClick}>
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
};
