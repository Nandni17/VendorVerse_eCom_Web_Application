const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Product = require("../models/Product");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No items" });
    }

    // ✅ Fetch products
    const productIds = orderItems.map(i => i.product);

    const products = await Product.find({
      _id: { $in: productIds }
    });

    // ✅ Build Stripe line items
    const line_items = orderItems.map(item => {
      const product = products.find(
        p => p._id.toString() === item.product
      );

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100, // paise
        },
        quantity: item.quantity,
      };
    });

   const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],

  line_items,

  mode: "payment",

  success_url:
    //"http://localhost:5173/order-success",
    "https://vendor-verse-e-com-web-application.vercel.app/order-success",


  cancel_url:
    //"http://localhost:5173/payment-cancel",
    "https://vendor-verse-e-com-web-application.vercel.app/payment-cancel",

  metadata: {
    userId: req.user._id.toString(),
    orderItems: JSON.stringify(orderItems),
  },
});

    res.json({ url: session.url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};