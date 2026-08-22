const User = require("../models/User");
const uploadToCloudinary = require("../config/uploadToCloudinary");

// ==========================================
// GET MY PROFILE
// ==========================================

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -emailVerificationCode -emailVerificationExpires"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);

    return res.status(500).json({
      message: "Unable to load profile",
      error: err.message,
    });
  }
};


// ==========================================
// UPDATE MY PROFILE
// ==========================================

exports.updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      bio,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update text fields only if provided
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (address !== undefined) {
      user.address = address.trim();
    }

    if (city !== undefined) {
      user.city = city.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    // Upload profile image to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      user.profileImage = result.secure_url;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select(
      "-password -emailVerificationCode -emailVerificationExpires"
    );

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);

    return res.status(500).json({
      message: "Unable to update profile",
      error: err.message,
    });
  }
};