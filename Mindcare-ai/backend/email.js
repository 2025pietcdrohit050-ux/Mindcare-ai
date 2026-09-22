const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// SEND OTP
async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: `"MindCare AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "MindCare AI - Verification OTP",
    text: `Your MindCare AI verification OTP is ${otp}. This OTP is valid for 10 minutes.`,
  });
}


// SEND FEEDBACK NOTIFICATION
async function sendFeedbackNotification(feedback) {
  await transporter.sendMail({
    from: `"MindCare AI" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,

    subject: `MindCare AI - New Feedback ⭐ ${feedback.rating}/5`,

    text: `
New feedback has been submitted on MindCare AI.

USER DETAILS
Name: ${feedback.userName}
Email: ${feedback.userEmail}

FEEDBACK DETAILS
Category: ${feedback.category}
Game: ${feedback.game || "Not related to a game"}
Rating: ${feedback.rating}/5
Difficulty: ${feedback.difficulty || "Not specified"}

MESSAGE
${feedback.message}

Status: ${feedback.status}

Submitted: ${new Date(feedback.createdAt).toLocaleString("en-IN")}
`,
  });
}


module.exports = {
  sendOTP,
  sendFeedbackNotification,
};