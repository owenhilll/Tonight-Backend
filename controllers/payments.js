import jwt from "jsonwebtoken";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getPublishableKey = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    res.status(200).json(process.env.PUBLISHABLE_KEY);
  });
};

export const paymentSheet = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    const customer = await stripe.customers.create({
      stripeAccount: "{{CONNECTED_ACCOUNT_ID}}",
    });

    const customerSession = await stripe.customerSessions.create({
      customer: customer.id,
      components: {
        mobile_payment_element: {
          enabled: true,
          features: {
            payment_method_save: "enabled",
            payment_method_redisplay: "enabled",
            payment_method_remove: "enabled",
          },
        },
      },
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "USD",
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      customerSessionClientSecret: customerSession.client_secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  });
};

export const checkoutSessionWeb = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    ui_mode: "embedded",
    return_url: `${process.env.FRONTEND_URL}/profile/success?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({ clientSecret: session.client_secret });
};

export const sessionStatus = async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
};
