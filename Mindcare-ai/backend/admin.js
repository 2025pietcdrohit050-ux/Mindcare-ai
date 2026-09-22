const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const router = express.Router();


// AUTHENTICATION
async function authenticateAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

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


// GET ALL REGISTERED USERS
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
      console.error("Admin users error:", error);

      res.status(500).json({
        message: "Failed to fetch users",
      });
    }
  }
);


module.exports = router;