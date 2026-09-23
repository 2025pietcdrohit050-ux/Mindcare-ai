const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Feedback = require("./models/Feedback");
const GameScore = require("./models/GameScore");

const router = express.Router();


// =====================================
// ADMIN AUTHENTICATION
// =====================================

async function authenticateAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (
      !adminEmail ||
      user.email.toLowerCase() !== adminEmail.toLowerCase()
    ) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.admin = user;

    next();

  } catch (error) {
    console.error("Admin authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}


// =====================================
// ADMIN DASHBOARD STATS
// =====================================

router.get(
  "/stats",
  authenticateAdmin,
  async (req, res) => {
    try {

      const totalUsers = await User.countDocuments();

      const verifiedUsers = await User.countDocuments({
        emailVerified: true,
      });

      const totalFeedback = await Feedback.countDocuments();

      const newFeedback = await Feedback.countDocuments({
        status: "New",
      });

      const totalGames = await GameScore.countDocuments();

      const feedbackData = await Feedback.find()
        .select("rating");

      let averageRating = 0;

      if (feedbackData.length > 0) {
        const totalRating = feedbackData.reduce(
          (sum, item) => sum + Number(item.rating || 0),
          0
        );

        averageRating = (
          totalRating / feedbackData.length
        ).toFixed(1);
      }

      res.json({
        totalUsers,
        verifiedUsers,
        totalFeedback,
        newFeedback,
        totalGames,
        averageRating,
      });

    } catch (error) {

      console.error(
        "Admin stats error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch admin statistics",
      });
    }
  }
);


// =====================================
// ALL REGISTERED USERS
// =====================================

router.get(
  "/users",
  authenticateAdmin,
  async (req, res) => {
    try {

      const users = await User.find()
        .select(
          "name email phone emailVerified phoneVerified createdAt"
        )
        .sort({
          createdAt: -1,
        });

      res.json({
        totalUsers: users.length,
        users,
      });

    } catch (error) {

      console.error(
        "Admin users error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch users",
      });
    }
  }
);


// =====================================
// ALL USER FEEDBACK
// =====================================

router.get(
  "/feedback",
  authenticateAdmin,
  async (req, res) => {
    try {

      const feedback = await Feedback.find()
        .sort({
          createdAt: -1,
        });

      res.json({
        totalFeedback: feedback.length,
        feedback,
      });

    } catch (error) {

      console.error(
        "Admin feedback error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch feedback",
      });
    }
  }
);


// =====================================
// UPDATE FEEDBACK STATUS
// =====================================

router.patch(
  "/feedback/:id",
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

      const feedback = await Feedback.findByIdAndUpdate(
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
        message: "Feedback status updated",
        feedback,
      });

    } catch (error) {

      console.error(
        "Admin feedback update error:",
        error
      );

      res.status(500).json({
        message: "Failed to update feedback",
      });
    }
  }
);


// =====================================
// ALL GAME SCORES / ACTIVITY
// =====================================

router.get(
  "/scores",
  authenticateAdmin,
  async (req, res) => {
    try {

      const scores = await GameScore.find()
        .sort({
          createdAt: -1,
        });

      res.json({
        totalGames: scores.length,
        scores,
      });

    } catch (error) {

      console.error(
        "Admin scores error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch game activity",
      });
    }
  }
);


module.exports = router;