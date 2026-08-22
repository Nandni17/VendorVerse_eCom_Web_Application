const express = require("express");

const {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
} = require("../controllers/authController");

const router = express.Router();


// =========================
// REGISTER
// =========================

router.post(
  "/register",
  register
);


// =========================
// VERIFY EMAIL
// =========================

router.post(
  "/verify-email",
  verifyEmail
);


// =========================
// RESEND OTP
// =========================

router.post(
  "/resend-verification",
  resendVerificationCode
);


// =========================
// LOGIN
// =========================

router.post(
  "/login",
  login
);


module.exports = router;