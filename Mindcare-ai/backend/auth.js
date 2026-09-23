const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const { sendOTP, sendResetOTP } = require("./email");

const router = express.Router();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or phone number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      emailVerified: false,
      phoneVerified: false,
      emailOTP: otp,
      emailOTPExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendResetOTP(email, otp);

    res.status(201).json({
      message: "Account created. OTP sent to your email.",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Signup failed",
    });
  }
});


// VERIFY EMAIL OTP
router.post("/verify-email", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        message: "User ID and OTP are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.emailOTP || user.emailOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (!user.emailOTPExpires || user.emailOTPExpires < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    user.emailVerified = true;
    user.emailOTP = null;
    user.emailOTPExpires = null;

    await user.save();

    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Email verification failed",
    });
  }
});


// FORGOT PASSWORD - SEND OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const otp = generateOTP();

    await User.updateOne(
  { _id: user._id },
  {
    $set: {
      resetOTP: otp,
      resetOTPExpires: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    },
  }
);

await sendOTP(email, otp);

    res.json({
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to send password reset OTP",
    });
  }
});


// VERIFY FORGOT PASSWORD OTP
router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.resetOTP || user.resetOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (
      !user.resetOTPExpires ||
      user.resetOTPExpires < new Date()
    ) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    res.json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "OTP verification failed",
    });
  }
});


// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const {
      email,
      otp,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !email ||
      !otp ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.resetOTP || user.resetOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (
      !user.resetOTPExpires ||
      user.resetOTPExpires < new Date()
    ) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    user.resetOTP = null;
    user.resetOTPExpires = null;

    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Password reset failed",
    });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before login",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});


module.exports = router;