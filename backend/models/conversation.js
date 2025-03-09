const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    groupTitle: {
      type: String,
      required: true, // groupTitle is required for the conversation
    },
    members: {
      type: [String], // Array of user and seller IDs (user and seller)
      required: true, // members should always be provided
    },
    lastMessage: {
      type: String,
      required: false, // lastMessage is optional (could be empty initially)
    },
    lastMessageId: {
      type: String,
      required: false, // lastMessageId is optional (could be empty initially)
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Conversation", conversationSchema);
