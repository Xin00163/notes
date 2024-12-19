import Stripe from "stripe";
import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { Billing } from "@notes/core/billing";

export const main = Util.handler(async (event) => {
  // The storage variable is the number of notes the user would like to store in his account. 
  // And source is the Stripe token for the card that we are going to charge.
  const { storage, source } = JSON.parse(event.body || "{}");
  // We are using a Billing.compute(storage) function, that we are going to add soon; 
  // to figure out how much to charge a user based on the number of notes that are going to be stored.
  const amount = Billing.compute(storage);
  const description = "Scratch charge";

  // We create a new Stripe object using our Stripe Secret key. We are getting this from the secret that we configured in the previous chapter. 
  // At the time of writing, we are using apiVersion 2024-06-20 but you can check the Stripe docs for the latest version.
  const stripe = new Stripe(
    // Load our secret key
    Resource.StripeSecretKey.value,
    { apiVersion: "2024-06-20"}
  );

  // we use the stripe.charges.create() function to 
  // charge the user and respond to the request if everything went through successfully.
  await stripe.charges.create({
    source, 
    amount,
    description,
    currency: "usd",
  });

  return JSON.stringify({ status: true})
})