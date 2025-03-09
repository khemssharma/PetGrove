const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true, // conversationId is required for message association
    },
    text: {
      type: String,
      required: true, // text content of the message is required
    },
    sender: {
      type: String,
      required: true, // sender information is required
    },
    images: {
      public_id: {
        type: String,
        required: false, // optional field for Cloudinary public_id if an image is attached
      },
      url: {
        type: String,
        required: false, // optional field for Cloudinary image URL
      },
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Messages", messagesSchema);
