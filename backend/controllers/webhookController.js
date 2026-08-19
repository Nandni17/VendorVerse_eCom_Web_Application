const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

exports.stripeWebhook = async (req, res) => {
  let event;

  // ==========================================
  // VERIFY STRIPE SIGNATURE
  // ==========================================

  try {
    const signature = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("✅ Stripe webhook verified:", event.type);

  } catch (err) {
    console.error(
      "❌ Webhook signature error:",
      err.message
    );

    return res
      .status(400)
      .send(`Webhook Error: ${err.message}`);
  }


  // ==========================================
  // SUCCESSFUL CHECKOUT
  // ==========================================

  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({
      received: true,
    });
  }


  const sessionData = event.data.object;

  console.log(
    "💳 Checkout completed:",
    sessionData.id
  );

console.log("🔥 NEW PAYMENT METADATA:", sessionData.metadata);

  // ==========================================
  // METADATA
  // ==========================================

  try {

    const userId =
      sessionData.metadata?.userId;

    const rawOrderItems =
      sessionData.metadata?.orderItems;

    if (!userId || !rawOrderItems) {
      throw new Error(
        "Missing userId or orderItems in Stripe metadata"
      );
    }

    const orderItems =
      JSON.parse(rawOrderItems);

    console.log(
      "👤 User:",
      userId
    );

    console.log(
      "📦 Order items:",
      orderItems
    );


    // ==========================================
    // MONGODB TRANSACTION
    // ==========================================

    const dbSession =
      await mongoose.startSession();

    try {

      dbSession.startTransaction();

      // ========================================
      // FETCH PRODUCTS
      // ========================================

      const productIds =
        orderItems.map(
          (item) => item.product
        );

      const products =
        await Product.find({
          _id: {
            $in: productIds,
          },
        }).session(dbSession);


      console.log(
        "📦 Products found:",
        products.length
      );


      if (products.length !== productIds.length) {
        throw new Error(
          "Some products were not found"
        );
      }


      // ========================================
      // PRODUCT MAP
      // ========================================

      const productMap = new Map();

      products.forEach((product) => {
        productMap.set(
          product._id.toString(),
          product
        );
      });


      // ========================================
      // SELLER GROUPING
      // ========================================

      const sellerMap = {};


      for (const item of orderItems) {

        const product =
          productMap.get(
            item.product.toString()
          );


        if (!product) {
          throw new Error(
            `Product not found: ${item.product}`
          );
        }


        // ======================================
        // STOCK CHECK
        // ======================================

        console.log(
          `📊 ${product.name} stock before:`,
          product.stock
        );

        console.log(
          `📦 Requested quantity:`,
          item.quantity
        );


        if (
          product.stock < item.quantity
        ) {
          throw new Error(
            `Not enough stock for ${product.name}`
          );
        }


        // ======================================
        // SELLER
        // ======================================

        const sellerId =
          product.seller.toString();


        if (!sellerMap[sellerId]) {

          sellerMap[sellerId] = {
            items: [],
            totalPrice: 0,
          };

        }


        sellerMap[sellerId].items.push({
          product: product._id,
          quantity: item.quantity,
        });


        sellerMap[sellerId].totalPrice +=
          Number(product.price) *
          Number(item.quantity);


        // ======================================
        // REDUCE STOCK
        // ======================================

        product.stock -=
          Number(item.quantity);


        await product.save({
          session: dbSession,
        });


        console.log(
          `✅ ${product.name} stock after:`,
          product.stock
        );
      }


      // ==========================================
      // CREATE ONE ORDER PER SELLER
      // ==========================================

      for (const sellerId in sellerMap) {

        const sellerData =
          sellerMap[sellerId];


        const createdOrders =
          await Order.create(
            [
              {
                user: userId,

                seller: sellerId,

                orderItems:
                  sellerData.items,

                totalPrice:
                  sellerData.totalPrice,

                orderStatus: "processing",

                paymentStatus: "paid",

                paymentInfo: {
                  id: sessionData.id,
                  status: "paid",
                },

                paidAt: new Date(),
              },
            ],
            {
              session: dbSession,
            }
          );


        console.log(
          "✅ Order created:",
          createdOrders[0]._id
        );
      }


      // ==========================================
      // COMMIT
      // ==========================================

      await dbSession.commitTransaction();

      console.log(
        "✅ MongoDB transaction committed successfully"
      );

    } catch (dbError) {

      await dbSession.abortTransaction();

      console.error(
        "❌ MongoDB transaction failed:",
        dbError
      );

      throw dbError;

    } finally {

      await dbSession.endSession();
    }


  } catch (err) {

    console.error(
      "❌ Webhook order processing failed:",
      err
    );

    // Stripe received the webhook.
    // Your server logs the processing failure.
    return res.status(200).json({
      received: true,
      processed: false,
    });
  }


  return res.status(200).json({
    received: true,
    processed: true,
  });
};