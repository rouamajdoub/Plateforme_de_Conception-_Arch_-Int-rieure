// Backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Architect = require("../models/Architect");
const { FRONTEND_URL } = process.env;

router.post("/create-subscription", async (req, res) => {
    try {
      const { architectId, email, plan } = req.body;
      
      // Find architect to get/create customerId if needed
      const architect = await Architect.findById(architectId);
      if (!architect) {
        return res.status(404).json({ error: "Architect not found" });
      }
      
      // Get the appropriate price ID based on the plan
      let priceId;
      if (plan === "Premium") {
        priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
      } else if (plan === "VIP") {
        priceId = process.env.STRIPE_VIP_PRICE_ID;
      } else {
        return res.status(400).json({ error: "Invalid plan selected" });
      }
      
      // Create checkout session for subscription
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription", // Change to subscription mode
        client_reference_id: architectId,
        customer_email: email,
        metadata: {
          plan,
        },
        line_items: [
          {
            price: priceId, // Use the price ID from your Stripe dashboard
            quantity: 1,
          },
        ],
        success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_URL}/payment-cancelled`,
      });
  
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      res.status(500).json({ error: "Unable to create checkout session" });
    }
  });

module.exports = router;
