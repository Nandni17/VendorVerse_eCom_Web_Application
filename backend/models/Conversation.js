const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One buyer + seller + product should have one conversation
// conversationSchema.index(
//   { buyer: 1, seller: 1, product: 1 },
//   { unique: true }
// );

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);