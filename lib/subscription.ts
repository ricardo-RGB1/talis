import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

const DAY_IN_MS = 84_400_000; // 24 hours


/**
 * Checks if the organization has an active subscription.
 *
 * @returns A promise that resolves to a boolean indicating whether the organization has an active subscription.
 */
export const checkSubscription = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return false;
  }

  /**
   * Retrieves the organization subscription details from the database.
   *
   * @param orgId - The ID of the organization.
   * @returns The organization subscription details.
   */
  const orgSubscription = await db.orgSubscription.findUnique({
    where: { orgId },
    select: {
      // Only select the fields we need
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!orgSubscription) { // If the organization has no subscription details, return false
    return false;
  }

  // Check if the subscription is valid
    const isValid = 
        orgSubscription.stripePriceId && 
        orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now(); // If the current period end date is in the future, the subscription is active

  
    return !!isValid; // Return true if the subscription is valid, false otherwise
};
