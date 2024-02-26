"use client";

import Image from "next/image";
import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const ProModal = () => {
  const proModal = useProModal(); // get the pro modal context

  /**
   * Executes the `stripeRedirect` action and handles the success and error cases.
   */
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data; // Redirect to the Stripe checkout session URL
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  /**
   * Handles the upgrade button click event.
   */
  const onClick = () => {
    execute({}); // Execute the `stripeRedirect` action
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image
            src="/nightScene.jpg"
            alt="night scene"
            className="object-cover"
            fill
          />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">Upgrade to Talis Pro Today!</h2>
          <p className="text-md font-semibold text-neutral-600">
            Explore the best of Talis:
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>And much more!</li>
            </ul>
          </div>
          <Button
            onClick={onClick} // Handle the upgrade button click event
            disabled={isLoading} // Disable the button when the action is loading
            className="w-full"
            variant="primary"
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
