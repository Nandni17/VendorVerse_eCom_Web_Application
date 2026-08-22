const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// =====================================================
// CREATE OR GET CONVERSATION
// Buyer ↔ Seller
// =====================================================

exports.createConversation = async (req, res) => {
  try {
    const { sellerId, productId } = req.body;

    // Only buyer can start a conversation
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        message: "Only buyers can start a conversation",
      });
    }

    // Check seller exists
    const seller = await User.findById(sellerId);

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    if (seller.role !== "seller") {
      return res.status(400).json({
        message: "Selected user is not a seller",
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      buyer: req.user._id,
      seller: sellerId,
      ...(productId ? { product: productId } : {}),
    });

    // If conversation already exists
    if (conversation) {
      return res.status(200).json({
        message: "Conversation already exists",
        conversation,
      });
    }

    // Create new conversation
    conversation = await Conversation.create({
      buyer: req.user._id,
      seller: sellerId,
      product: productId || undefined,
    });

    return res.status(201).json({
      message: "Conversation created successfully",
      conversation,
    });
  } catch (err) {
    console.error("Create conversation error:", err);

    return res.status(500).json({
      message: "Unable to create conversation",
      error: err.message,
    });
  }
};

// =====================================================
// SEND MESSAGE
// =====================================================

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    // Find conversation
    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Check whether current user belongs to conversation
    const isBuyer =
      conversation.buyer.toString() ===
      req.user._id.toString();

    const isSeller =
      conversation.seller.toString() ===
      req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        message: "You are not part of this conversation",
      });
    }

    // Determine receiver
    const receiver = isBuyer
      ? conversation.seller
      : conversation.buyer;

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      receiver,
      text: text.trim(),
    });

    // Update last message
    conversation.lastMessage = text.trim();
conversation.lastMessageAt = new Date();

    await conversation.save();

    // Return populated message
    const populatedMessage = await Message.findById(
      message._id
    )
      .populate("sender", "name email role")
      .populate("receiver", "name email role");

    return res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (err) {
    console.error("Send message error:", err);

    return res.status(500).json({
      message: "Unable to send message",
      error: err.message,
    });
  }
};

// =====================================================
// GET CONVERSATION MESSAGES
// =====================================================

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Check access
    const isBuyer =
      conversation.buyer.toString() ===
      req.user._id.toString();

    const isSeller =
      conversation.seller.toString() ===
      req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        message: "You are not part of this conversation",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);

    return res.status(500).json({
      message: "Unable to load messages",
      error: err.message,
    });
  }
};

// =====================================================
// GET MY CONVERSATIONS
// =====================================================

exports.getMyConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      $or: [
        { buyer: userId },
        { seller: userId },
      ],
    })
      .populate("buyer", "name email role")
      .populate("seller", "name email role")
      .populate("product", "name price image")
      .sort({ updatedAt: -1 });

    return res.json(conversations);
  } catch (err) {
    console.error(
      "Get conversations error:",
      err
    );

    return res.status(500).json({
      message: "Unable to load conversations",
      error: err.message,
    });
  }
};

// =====================================================
// EDIT MESSAGE
// =====================================================

exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    // Check message text
    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    // Find message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    // Only sender can edit their own message
    if (
      message.sender.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only edit your own messages",
      });
    }

    // Update message
    message.text = text.trim();

    await message.save();

    // Return populated message
    const updatedMessage = await Message.findById(
      message._id
    )
      .populate("sender", "name email role")
      .populate("receiver", "name email role");

    return res.json({
      message: "Message updated successfully",
      data: updatedMessage,
    });

  } catch (err) {
    console.error("Edit message error:", err);

    return res.status(500).json({
      message: "Unable to edit message",
      error: err.message,
    });
  }
};


// =====================================================
// DELETE MESSAGE
// =====================================================

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Find message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    // Only sender can delete their own message
    if (
      message.sender.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only delete your own messages",
      });
    }

    // Delete message
    await Message.findByIdAndDelete(messageId);

    return res.json({
      message: "Message deleted successfully",
    });

  } catch (err) {
    console.error("Delete message error:", err);

    return res.status(500).json({
      message: "Unable to delete message",
      error: err.message,
    });
  }
};