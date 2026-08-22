const express = require("express");

const {
  createConversation,
  sendMessage,
  getMessages,
  getMyConversations,
  editMessage,
  deleteMessage,
} = require("../controllers/chatController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE / GET CONVERSATION
// ==========================================

router.post(
  "/conversation",
  protect,
  createConversation
);

// ==========================================
// GET MY CONVERSATIONS
// ==========================================

router.get(
  "/conversations",
  protect,
  getMyConversations
);

// ==========================================
// SEND MESSAGE
// ==========================================

router.post(
  "/conversation/:conversationId/message",
  protect,
  sendMessage
);

// ==========================================
// EDIT MESSAGE
// ==========================================

router.put(
  "/message/:messageId",
  protect,
  editMessage
);


// ==========================================
// DELETE MESSAGE
// ==========================================

router.delete(
  "/message/:messageId",
  protect,
  deleteMessage
);

// ==========================================
// GET MESSAGES
// ==========================================

router.get(
  "/conversation/:conversationId/messages",
  protect,
  getMessages
);

module.exports = router;