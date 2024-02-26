"use server";

import { auth, currentUser } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { StripeRedirect } from "./schema";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

/**
 * Handles the copy list action.
 *
 * @param data - The input data for the action.
 * @returns A promise that resolves to the return type of the action.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser(); // Get the current user

  if (!userId || !orgId || !user) {
    // Ensure the user is authenticated
    return {
      error: "Unauthorized",
    };
  }

  // The URL to redirect to after the Stripe checkout session is completed
  const settingsUrl = absoluteUrl(`/organization/${orgId}`);

  let url = ""; // The URL to redirect to

  // Create a new Stripe checkout session
  try {
    // Get the organization's subscription
    const orgSubscription = await db.orgSubscription.findUnique({
      where: {
        orgId,
      },
    });

    // If the organization has a Stripe customer ID, create a new Stripe checkout session
    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl, // The URL to redirect to after the Stripe checkout session is completed
      });

      // Get the URL to redirect to
      url = stripeSession.url;
    } else {
      // If the organization does not have a Stripe customer ID, create a new Stripe checkout session
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl, // The URL to redirect to after successful payment
        cancel_url: settingsUrl, // The URL to redirect to after the payment is canceled
        payment_method_types: ["card"], // The payment method types that the customer can use
        mode: "subscription", // The mode of the checkout session
        billing_address_collection: "auto", // The billing address collection settings
        customer_email: user.emailAddresses[0].emailAddress, // The customer's email address
        line_items: [
          {
            price_data: {
              currency: "USD", // The currency of the price
              product_data: {
                name: "Talis Pro", // The name of the product
                description: "Unlimited boards for your organization",
              },
              unit_amount: 2000,
              recurring: {
                interval: "month", // The interval of the subscription
              },
            },
            quantity: 1, // The quantity of the product
          },
        ],
        metadata: {
          orgId,
        },
      });

      // Get the URL to redirect to
      url = stripeSession.url || "";
    }
  } catch {
    return {
      error: "Failed to create Stripe checkout session",
    };
  }

  // Revaliate the organization's cache
  revalidatePath(`/organization/${orgId}`);
  return{ data: url };

};

// Export the action
export const stripeRedirect = createSafeAction(StripeRedirect, handler);
