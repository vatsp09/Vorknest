
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Existing job-based conversations
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
    },

    // New gig-based conversations
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Keep one conversation per proposal or order.
conversationSchema.index(
  { proposal: 1 },
  { unique: true, partialFilterExpression: { proposal: { $exists: true } } }
);

conversationSchema.index(
  { order: 1 },
  { unique: true, partialFilterExpression: { order: { $exists: true } } }
);

module.exports = mongoose.model("Conversation", conversationSchema);
