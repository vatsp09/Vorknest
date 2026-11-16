
const express = require("express");
const router = express.Router();

const {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");

// Get all conversations of logged-in user
router.get("/conversations", protect, getConversations);

// Get messages from a particular conversation
router.get("/:conversationId", protect, getMessages);

// Send a message
router.post("/:conversationId", protect, sendMessage);

// Mark received messages as read
router.put("/:conversationId/read", protect, markMessagesAsRead);

module.exports = router;
