const Messages = require("../models/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("../cloudinary"); // Import the cloudinary config
const router = require("express").Router();

// Create new message
router.post(
  "/create-new-message",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messageData = req.body;

      // Check if images are provided in the request body
      if (req.body.images) {
        // Upload image to Cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
          folder: "messages", // Folder in Cloudinary where images will be stored
        });

        // Save Cloudinary response (public_id and url)
        messageData.images = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      // Populate other message fields
      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;

      // Create and save the message in the database
      const message = new Messages({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined, // Only attach images if they exist
      });

      await message.save();

      // Respond with success and the saved message
      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      // Handle errors and pass them to the error handler middleware
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Find messages by conversation ID
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      // Respond with success and the retrieved messages
      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      // Handle errors and pass them to the error handler middleware
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
