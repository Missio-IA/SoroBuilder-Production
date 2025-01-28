// backend/index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Stripe = require("stripe");

// 1) Firebase Admin
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// 2) Config Stripe
const stripe = new Stripe("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"); 
const endpointSecret = "whsec_YkDjfmkyznRwy1pMCXIt8gu86DDJFAdr";

const app = express();
app.use(cors());

// ------------------------------------------------------
// 1) Ruta /webhook con bodyParser.raw
//    (antes de express.json())
// ------------------------------------------------------
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }), // <--- raw
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      // Aquí req.body es un Buffer crudo, OK para constructEvent
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
      console.error("Webhook signature verification failed:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("Checkout session completed:", session.id);

        const { userId } = session.metadata || {};
        if (!userId) {
          console.warn("No userId in session.metadata, can't add credits!");
          break;
        }

        // line_items => saber cuántos compró
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        let totalQuantity = 0;
        lineItems.data.forEach((item) => {
          totalQuantity += item.quantity;
        });

        console.log(`User ${userId} bought ${totalQuantity} credits`);

        await db
          .collection("users")
          .doc(userId)
          .update({
            credits: admin.firestore.FieldValue.increment(totalQuantity),
          });
        console.log(`Sumados ${totalQuantity} créditos al usuario ${userId}.`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.sendStatus(200);
  }
);

// ------------------------------------------------------
// 2) Para el RESTO de rutas => express.json()
// ------------------------------------------------------
app.use(express.json());

// Endpoint para crear Payment Link
app.post("/api/create-payment-link", async (req, res) => {
  try {
    const { userId, quantity } = req.body;
    if (!userId || !quantity) {
      return res.status(400).json({ error: "userId and quantity are required." });
    }

    const PRICE_ID = "price_1QmJTtEoPPcLrTW0pzrLmUUS"; // tu precio en Stripe
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: PRICE_ID,
          quantity,
        },
      ],
      metadata: { userId },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `https://sorobuilder.com/payment-success?userId=${userId}`,
        },
      },
    });

    return res.json({ url: paymentLink.url });
  } catch (err) {
    console.error("Error creating payment link:", err);
    return res.status(500).json({ error: err.message });
  }
});

exports.stripenode = onRequest(app); 
