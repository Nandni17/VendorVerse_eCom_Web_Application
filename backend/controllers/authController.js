const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendVerificationEmail = require("../utils/sendEmail");

require("dotenv").config();

// =========================
// GENERATE OTP
// =========================

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};


// =========================
// REGISTER
// =========================

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    const userExists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (userExists) {

      // If account exists but email is not verified,
      // allow user to request another OTP.
      if (!userExists.isEmailVerified) {

        const verificationCode = generateOTP();

        userExists.emailVerificationCode = verificationCode;

        userExists.emailVerificationExpires =
          new Date(Date.now() + 10 * 60 * 1000);

        await userExists.save();

        await sendVerificationEmail(
          userExists.email,
          userExists.name,
          verificationCode
        );

        return res.status(200).json({
          message:
            "Account exists but email is not verified. A new verification code has been sent.",
          requiresVerification: true,
          email: userExists.email,
        });
      }

      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const allowedRoles = ["buyer", "seller"];

    const selectedRole = allowedRoles.includes(role)
      ? role
      : "buyer";

    // Generate OTP
    const verificationCode = generateOTP();

    // OTP expires after 10 minutes
    const verificationExpires =
      new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: selectedRole,

      isEmailVerified: false,

      emailVerificationCode:
        verificationCode,

      emailVerificationExpires:
        verificationExpires,
    });

    // Send email
    await sendVerificationEmail(
      user.email,
      user.name,
      verificationCode
    );

    return res.status(201).json({
      message:
        "Registration successful. Please check your email for the verification code.",

      requiresVerification: true,

      email: user.email,
    });

  } catch (err) {

    console.error(
      "Registration error:",
      err
    );

    return res.status(500).json({
      message:
        "Registration failed. Please try again.",
      error: err.message,
    });
  }
};


// =========================
// VERIFY EMAIL
// =========================

exports.verifyEmail = async (req, res) => {
  try {

    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message:
          "Email and verification code are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    // Check OTP
    if (
      user.emailVerificationCode !== code
    ) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    // Check expiry
    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      return res.status(400).json({
        message:
          "Verification code has expired. Please request a new code.",
      });
    }

    // Verify email
    user.isEmailVerified = true;

    // Remove OTP after successful verification
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return res.json({
      message:
        "Email verified successfully. You can now login.",
    });

  } catch (err) {

    console.error(
      "Email verification error:",
      err
    );

    return res.status(500).json({
      message:
        "Email verification failed",
      error: err.message,
    });
  }
};


// =========================
// RESEND VERIFICATION CODE
// =========================

exports.resendVerificationCode = async (
  req,
  res
) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    // Generate new OTP
    const verificationCode = generateOTP();

    user.emailVerificationCode =
      verificationCode;

    user.emailVerificationExpires =
      new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    // Send email
    await sendVerificationEmail(
      user.email,
      user.name,
      verificationCode
    );

    return res.json({
      message:
        "A new verification code has been sent to your email.",
    });

  } catch (err) {

    console.error(
      "Resend OTP error:",
      err
    );

    return res.status(500).json({
      message:
        "Unable to resend verification code",
      error: err.message,
    });
  }
};


// =========================
// LOGIN
// =========================

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

// console.log("LOGIN EMAIL:", email);
// console.log("USER FOUND:", !!user);
// console.log("STORED PASSWORD:", user?.password);
// console.log("EMAIL VERIFIED:", user?.isEmailVerified);

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // =========================
    // EMAIL VERIFICATION CHECK
    // =========================

    if (!user.isEmailVerified) {

      return res.status(403).json({
        message:
          "Please verify your email before logging in.",
        requiresVerification: true,
        email: user.email,
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

  //  console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    return res.json({

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified:
          user.isEmailVerified,
      },

    });

  } catch (err) {

    console.error(
      "Login error:",
      err
    );

    return res.status(500).json({
      error: err.message,
    });
  }
};