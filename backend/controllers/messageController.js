const Conversation = require("../models/Conversation");
const Message = require("../models/Message");



const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      $or: [
        { client: req.user._id },
        { freelancer: req.user._id },
      ],
    })
      .populate("client", "name avatar")
      .populate("freelancer", "name avatar")
      .populate("job", "title")
      .sort({ lastMessageAt: -1 });

    // Calculate unread messages for each conversation
    const conversationsWithUnreadCount = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await Message.countDocuments({
          conversation: conversation._id,
          sender: { $ne: req.user._id },
          isRead: false,
        });

        return {
          ...conversation.toObject(),
          unreadCount,
        };
      })
    );

    res.status(200).json(conversationsWithUnreadCount);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(
      req.params.conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Only conversation participants can access messages
    const isParticipant =
      conversation.client.toString() === req.user._id.toString() ||
      conversation.freelancer.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        message: "Not authorized to access this conversation",
      });
    }

    const messages = await Message.find({
      conversation: conversation._id,
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        message: "Message cannot exceed 5000 characters",
      });
    }

    const conversation = await Conversation.findById(
      req.params.conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Verify that sender belongs to this conversation
    const isParticipant =
      conversation.client.toString() === req.user._id.toString() ||
      conversation.freelancer.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        message: "Not authorized to send messages",
      });
    }

    // Create and save message
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim(),
    });

    // Update conversation preview
    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = message.createdAt;

    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name avatar");

    res.status(201).json(populatedMessage);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const markMessagesAsRead = async (req, res) => {
  try {
    const conversation = await Conversation.findById(
      req.params.conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const isParticipant =
      conversation.client.toString() === req.user._id.toString() ||
      conversation.freelancer.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await Message.updateMany(
      {
        conversation: conversation._id,
        sender: { $ne: req.user._id },
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    res.status(200).json({
      message: "Messages marked as read",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
};