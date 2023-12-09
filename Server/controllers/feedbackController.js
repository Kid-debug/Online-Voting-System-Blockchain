//feedbackController.js
const User = require("../models/user");
const Feedback = require("../models/feedback");
// const sequelize = require("../config/sequelize");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//user
const submitFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.body.userId;
    const selectedEmotion = req.body.selectedEmotion;
    const feedbackText = req.body.feedbackText;

    if (![1, 2, 3, 4, 5].includes(selectedEmotion)) {
      return res.status(400).json({ msg: "Invalid emotion value." });
    }

    // Check Feedback Length
    if (feedbackText.length > 300) {
      return res
        .status(400)
        .json({ msg: "Feedback text exceeds the maximum length." });
    }
    try {
      // insert feedback
      await Feedback.create({
        user_id: userId,
        rating: selectedEmotion,
        content: feedbackText,
      });

      return res.status(200).json({ msg: "Feedback submitted successfully." });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    return res.status(500).json({ msg: error });
  }
};

const getFeedbackByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;

    try {
      const feedbacks = await Feedback.findAll({
        where: { user_id: userId },
      });

      if (feedbacks.length > 0) {
        return res.status(200).json(feedbacks);
      } else {
        return res.status(404).json({ msg: `No feedback found!.` });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ msg: "Server error while retrieving feedbacks." });
    }
  } catch (error) {
    console.error("Error in retrieve feedback:", error);
    return res.status(500).json({ msg: error });
  }
};

const editUserFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { feedbackId } = req.params;
    const selectedEmotion = req.body.selectedEmotion;
    const feedbackText = req.body.feedbackText;

    if (![1, 2, 3, 4, 5].includes(selectedEmotion)) {
      return res.status(400).json({ msg: "Invalid emotion value." });
    }

    // Check Feedback Length
    if (feedbackText.length > 300) {
      return res
        .status(400)
        .json({ msg: "Feedback text exceeds the maximum length." });
    }
    try {
      // update feedback
      await Feedback.update(
        {
          rating: selectedEmotion,
          content: feedbackText,
        },
        { where: { feedback_id: feedbackId } }
      );

      return res.status(200).json({ msg: "Feedback updated successfully." });
    } catch (error) {
      console.error("Error updating feedback:", error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error in updateFeedback:", error);
    return res.status(500).json({ msg: error });
  }
};

//admin
// Controller function to retrieve all feedback
const retrieveFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      attributes: [
        "feedback_id",
        "user_id",
        "content",
        "rating",
        "status",
        "created_at",
        "updated_at",
      ],
      // Make sure 'user_id' is included in the attributes
    });
    return res.status(200).json(feedbacks);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Server error while retrieving feedbacks." });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;
    const feedback = await Feedback.findOne({
      where: { feedback_id: feedbackId },
      attributes: [
        "feedback_id",
        "user_id",
        "content",
        "rating",
        "status",
        "created_at",
        "updated_at",
      ],
    });

    if (!feedback) {
      return res.status(404).json({ msg: "Feedback not found" });
    }

    return res.status(200).json(feedback);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Server error while retrieving feedback." });
  }
};

const updateFeedback = async (req, res) => {
  // Extracting the validation errors from the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract the feedbackId from the URL and status from the request body
  const { feedbackId } = req.params;
  const { status } = req.body;

  try {
    // Find the feedback by ID
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return res.status(404).json({ msg: "Feedback not found." });
    }

    // Update the feedback's status
    feedback.status = status;
    await feedback.save();

    // Return a success response
    return res
      .status(200)
      .json({ msg: "Feedback updated successfully.", feedback });
  } catch (err) {
    console.error("Error updating feedback:", err);
    return res
      .status(500)
      .json({ msg: "Server error while updating feedback." });
  }
};

const deleteFeedback = async (req, res) => {
  const { feedbackId } = req.params;

  try {
    // Find the feedback with the user to ensure the user is loaded
    const feedbackToDelete = await Feedback.findByPk(feedbackId);

    if (!feedbackToDelete) {
      return res.status(404).json({ msg: "Feedback not found" });
    }

    // Delete the feedback
    await feedbackToDelete.destroy();

    // Optionally, you can retrieve the updated list of feedbacks after deletion
    const updatedFeedbacks = await Feedback.findAll();

    return res.status(200).json({
      msg: `Feedback deleted successfully`,
      feedbacks: updatedFeedbacks,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Server error while deleting feedback." });
  }
};

module.exports = {
  submitFeedback,
  retrieveFeedback,
  editUserFeedback,
  getFeedbackByUserId,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};
