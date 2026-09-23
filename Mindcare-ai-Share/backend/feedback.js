const express = require("express");
const jwt = require("jsonwebtoken");
const Feedback = require("./models/Feedback");
const User = require("./models/User");
const { sendFeedbackNotification } = require("./email");

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}


/* =================================
   ADMIN CHECK
================================= */

async function authenticateAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || user.email !== adminEmail) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.admin = user;

    next();

  } catch (error) {
    console.error("Admin check error:", error);

    return res.status(500).json({
      message: "Failed to verify admin access",
    });
  }
}


/* =================================
   SUBMIT FEEDBACK
================================= */

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      category,
      game,
      rating,
      difficulty,
      message,
    } = req.body;

    if (!category || !rating || !message) {
      return res.status(400).json({
        message:
          "Category, rating and message are required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const feedback = await Feedback.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      category,
      game: game || null,
      rating,
      difficulty: difficulty || null,
      message,
    });

    // Send notification email
    try {
      await sendFeedbackNotification(feedback);

      console.log(
        "Feedback notification email sent ✅"
      );

    } catch (emailError) {
      console.error(
        "Feedback email failed:",
        emailError.message
      );
    }

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });

  } catch (error) {
    console.error(
      "Feedback error:",
      error
    );

    res.status(500).json({
      message: "Failed to submit feedback",
    });
  }
});


/* =================================
   GET USER'S OWN FEEDBACK
================================= */

router.get(
  "/my",
  authenticateToken,
  async (req, res) => {
    try {
      const feedback = await Feedback.find({
        userId: req.userId,
      }).sort({
        createdAt: -1,
      });

      res.json({
        feedback,
      });

    } catch (error) {
      console.error(
        "Feedback fetch error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch feedback",
      });
    }
  }
);


/* =================================
   ADMIN - GET ALL FEEDBACK
================================= */

router.get(
  "/admin",
  authenticateToken,
  authenticateAdmin,
  async (req, res) => {
    try {
      const feedback = await Feedback.find()
        .sort({
          createdAt: -1,
        });

      const totalFeedback = feedback.length;

      const averageRating =
        totalFeedback > 0
          ? (
              feedback.reduce(
                (total, item) =>
                  total + item.rating,
                0
              ) / totalFeedback
            ).toFixed(1)
          : 0;

      const newFeedback = feedback.filter(
        (item) => item.status === "New"
      ).length;

      const reviewedFeedback = feedback.filter(
        (item) => item.status === "Reviewed"
      ).length;

      const resolvedFeedback = feedback.filter(
        (item) => item.status === "Resolved"
      ).length;

      res.json({
        summary: {
          totalFeedback,
          averageRating,
          newFeedback,
          reviewedFeedback,
          resolvedFeedback,
        },
        feedback,
      });

    } catch (error) {
      console.error(
        "Admin feedback fetch error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch admin feedback",
      });
    }
  }
);


/* =================================
   ADMIN - UPDATE FEEDBACK STATUS
================================= */

router.patch(
  "/admin/:id",
  authenticateToken,
  authenticateAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "New",
        "Reviewed",
        "Resolved",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid feedback status",
        });
      }

      const feedback =
        await Feedback.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
          }
        );

      if (!feedback) {
        return res.status(404).json({
          message: "Feedback not found",
        });
      }

      res.json({
        message:
          "Feedback status updated successfully",
        feedback,
      });

    } catch (error) {
      console.error(
        "Feedback status update error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update feedback status",
      });
    }
  }
);


module.exports = router;