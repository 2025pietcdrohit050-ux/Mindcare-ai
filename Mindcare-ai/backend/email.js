const https = require("https");

function sendEmail({ to, subject, html }) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      from: "MindCare AI <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    const options = {
      hostname: "api.resend.com",
      path: "/emails",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log("Email sent successfully ✅");
          resolve(JSON.parse(body));
        } else {
          console.error("Resend error:", body);
          reject(new Error(`Resend API error: ${res.statusCode}`));
        }
      });
    });

    req.on("error", (error) => {
      console.error("Email request failed:", error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function sendOTPEmail(email, otp) {
  return sendEmail({
    to: email,
    subject: "MindCare AI - Email Verification OTP",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>MindCare AI</h2>
        <p>Your verification OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `,
  });
}

async function sendResetOTPEmail(email, otp) {
  return sendEmail({
    to: email,
    subject: "MindCare AI - Password Reset OTP",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>MindCare AI</h2>
        <p>Your password reset OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `,
  });
}

async function sendFeedbackNotification(feedback) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.log("ADMIN_EMAIL not configured.");
    return;
  }

  return sendEmail({
    to: adminEmail,
    subject: `MindCare AI - New Feedback from ${feedback.userName}`,
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>New MindCare AI Feedback</h2>
        <p><strong>Name:</strong> ${feedback.userName}</p>
        <p><strong>Email:</strong> ${feedback.userEmail}</p>
        <p><strong>Category:</strong> ${feedback.category}</p>
        <p><strong>Rating:</strong> ${feedback.rating}/5</p>
        <p><strong>Message:</strong></p>
        <p>${feedback.message}</p>
      </div>
    `,
  });
}

module.exports = {
  sendOTPEmail,
  sendResetOTPEmail,
  sendFeedbackNotification,
};