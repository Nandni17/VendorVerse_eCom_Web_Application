const ContactMessage = require("../models/ContactMessage");

// ==========================================
// CREATE CONTACT MESSAGE
// ==========================================

exports.createContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    // Basic validation
    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        message:
          "Please fill in all required fields.",
      });
    }

    const contactMessage =
      await ContactMessage.create({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

    return res.status(201).json({
      message:
        "Your message has been sent successfully.",
      contactMessage,
    });

  } catch (err) {
    console.error(
      "Contact message error:",
      err
    );

    return res.status(500).json({
      message:
        "Unable to send your message.",
      error: err.message,
    });
  }
};

// ==========================================
// GET ALL CONTACT MESSAGES
// ADMIN ONLY
// ==========================================

exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({
        createdAt: -1,
      });

    res.json(messages);
  } catch (err) {
    console.error(
      "Get contact messages error:",
      err
    );

    res.status(500).json({
      message:
        "Unable to load contact messages.",
      error: err.message,
    });
  }
};


// ==========================================
// UPDATE MESSAGE STATUS
// ADMIN ONLY
// ==========================================

exports.updateContactMessageStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    if (!["read", "unread"].includes(status)) {
      return res.status(400).json({
        message: "Invalid message status.",
      });
    }

    const message =
      await ContactMessage.findById(
        req.params.id
      );

    if (!message) {
      return res.status(404).json({
        message: "Contact message not found.",
      });
    }

    message.status = status;

    await message.save();

    res.json(message);
  } catch (err) {
    console.error(
      "Update contact message error:",
      err
    );

    res.status(500).json({
      message:
        "Unable to update message status.",
      error: err.message,
    });
  }
};


// ==========================================
// DELETE CONTACT MESSAGE
// ADMIN ONLY
// ==========================================

exports.deleteContactMessage = async (
  req,
  res
) => {
  try {
    const message =
      await ContactMessage.findById(
        req.params.id
      );

    if (!message) {
      return res.status(404).json({
        message: "Contact message not found.",
      });
    }

    await message.deleteOne();

    res.json({
      message:
        "Contact message deleted successfully.",
    });
  } catch (err) {
    console.error(
      "Delete contact message error:",
      err
    );

    res.status(500).json({
      message:
        "Unable to delete contact message.",
      error: err.message,
    });
  }
};