import Stripe from 'stripe';



/**
 * Stripe API client instance.
 * @remarks
 * This instance is used to interact with the Stripe API.
 */
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2023-10-16",
    typescript: true,
})