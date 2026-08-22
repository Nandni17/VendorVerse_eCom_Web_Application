const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    // =========================
// PROFILE INFORMATION
// =========================

profileImage: {
  type: String,
  default: "",
},

phone: {
  type: String,
  default: "",
  trim: true,
},

address: {
  type: String,
  default: "",
  trim: true,
},

city: {
  type: String,
  default: "",
  trim: true,
},

bio: {
  type: String,
  default: "",
  trim: true,
},

    // =========================
    // EMAIL VERIFICATION
    // =========================

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationCode: {
      type: String,
    },

    emailVerificationExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);