// Backend\Stripe\webhook\route.js - Updated version
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Architect = mongoose.model("architect"); // Import architect model
const Subscription = mongoose.model("Subscription"); // Import subscription model

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    let event = request.body;

    if (endpointSecret) {
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    // 🎯 Handle successful checkout session
    // Update this part of your webhook handler
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Check if this is a subscription checkout
      if (session.mode === "subscription") {
        const architectId = session.client_reference_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription; // Get the subscription ID

        try {
          const architect = await Architect.findById(architectId);

          if (architect) {
            // Get more details about the subscription
            const stripeSubscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );

            // Update architect payment information
            architect.customerId = customerId;
            architect.hasAccess = true;
            architect.paymentStatus = "completed";

            // Calculate subscription dates from Stripe data
            const startDate = new Date(
              stripeSubscription.current_period_start * 1000
            );
            const endDate = new Date(
              stripeSubscription.current_period_end * 1000
            );

            // Get plan details from product
            const plan = session.metadata?.plan || "Premium";

            // Create a new subscription record
            const subscription = new Subscription({
              architectId: architectId,
              plan: plan,
              startDate: startDate,
              endDate: endDate,
              status: "active",
              price: stripeSubscription.plan.amount / 100,
              paymentMethod: "Card",
              transactions: [
                {
                  amount: stripeSubscription.plan.amount / 100,
                  date: new Date(),
                  transactionId: session.subscription,
                  status: "success",
                },
              ],
            });

            // Save the subscription
            const savedSubscription = await subscription.save();

            // Update architect with subscription reference
            architect.subscription = savedSubscription._id;
            await architect.save();

            console.log(
              `✅ Architect ${
                architect.email || architectId
              } subscription confirmed.`
            );
          }
        } catch (error) {
          console.error(
            "❌ Error updating architect after Stripe subscription:",
            error
          );
        }
      }
    }

    // Handle subscription lifecycle events
    else if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      await handleSubscriptionCancellation(subscription);
    }
    // 🧾 Optional: Handle other events
    else if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log(
        `✅ PaymentIntent for ${paymentIntent.amount} was successful!`
      );
    } else if (event.type === "payment_method.attached") {
      const paymentMethod = event.data.object;
      console.log("💳 Payment method attached");
    } else {
      console.log(`Unhandled event type ${event.type}.`);
    }

    response.send(); // Always respond with 200
  }
);

// Handle subscription updates
async function handleSubscriptionUpdate(stripeSubscription) {
  try {
    // Find the architect by Stripe customer ID
    const architect = await Architect.findOne({
      customerId: stripeSubscription.customer,
    });

    if (!architect) {
      console.log(
        "❌ Architect not found for customer:",
        stripeSubscription.customer
      );
      return;
    }

    // Find and update the subscription
    const subscription = await Subscription.findById(architect.subscription);

    if (subscription) {
      // Update subscription based on Stripe status
      if (stripeSubscription.status === "active") {
        subscription.status = "active";
      } else if (stripeSubscription.status === "canceled") {
        subscription.status = "cancelled";
      } else if (stripeSubscription.status === "unpaid") {
        subscription.status = "expired";
      }

      // Update end date if available
      if (stripeSubscription.current_period_end) {
        subscription.endDate = new Date(
          stripeSubscription.current_period_end * 1000
        );
      }

      await subscription.save();
      console.log(`✅ Subscription updated for architect ${architect._id}`);
    }
  } catch (error) {
    console.error("❌ Error updating subscription:", error);
  }
}

// Handle subscription cancellations
async function handleSubscriptionCancellation(stripeSubscription) {
  try {
    // Find the architect by Stripe customer ID
    const architect = await Architect.findOne({
      customerId: stripeSubscription.customer,
    });

    if (!architect) {
      console.log(
        "❌ Architect not found for customer:",
        stripeSubscription.customer
      );
      return;
    }

    // Update the subscription
    const subscription = await Subscription.findById(architect.subscription);

    if (subscription) {
      subscription.status = "cancelled";
      await subscription.save();
      console.log(`✅ Subscription cancelled for architect ${architect._id}`);
    }
  } catch (error) {
    console.error("❌ Error cancelling subscription:", error);
  }
}

module.exports = router;
