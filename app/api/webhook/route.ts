import Stripe from "stripe";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";



/**
 * Handles the POST request for the webhook route.
 * @param request - The incoming request object.
 * @returns A NextResponse object indicating the status of the request.
 */
export async function POST(request: Request) {
  const body = await request.text(); // Get the request body
  const signature = headers().get("Stripe-Signature") as string; // Get the stripe signature

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      // Construct the event
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse("Webhook Error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session; // Get the Stripe checkout session

  // If the event type is `checkout.session.completed` then retrieve the subscription; meaning the payment was successful
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // If the orgId is not present in the session metadata then return an error
    if (!session?.metadata?.orgId) {
      return new NextResponse("Org ID is required", { status: 400 });
    }

    // Create a new subscription in the database
    await db.orgSubscription.create({
      data: {
        orgId: session?.metadata?.orgId, // Get the orgId from the session metadata
        stripeSubscriptionId: subscription.id, // Get the subscription id from the session
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  // If the event type is `invoice.payment_succeeded` then retrieve the subscription; meaning the payment was successful
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await db.orgSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200}); 
}
