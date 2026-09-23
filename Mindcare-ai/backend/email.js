const https = require("https");

function sendEmail({ to, subject, html }) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sender: {
        name: "MindCare AI",
        email: "rohitkhandelwal629@gmail.com",
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    });

    const options = {
      hostname: "api.brevo.com",
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
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
          console.log("Brevo email sent successfully ✅");
          
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(body);
          }
        } else {
          console.error("Brevo error:", body);
          reject(
            new Error(`Brevo API error: ${res.statusCode}`)
          );
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


// REGISTRATION OTP
async function sendOTP(email, otp) {
  return sendEmail({
    to: email,
    subject: "MindCare AI - Email Verification OTP",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#74539f">MindCare AI</h2>

        <p>Your email verification OTP is:</p>

        <h1 style="font-size:36px;letter-spacing:8px;color:#4b386d">
          ${otp}
        </h1>

        <p>This OTP is valid for 10 minutes.</p>

        <p>If you did not create a MindCare AI account, you can ignore this email.</p>

        <p>Regards,<br>
        <strong>MindCare AI Team</strong></p>
      </div>
    `,
  });
}


// FORGOT PASSWORD OTP
async function sendResetOTP(email, otp) {
  return sendEmail({
    to: email,
    subject: "MindCare AI - Password Reset OTP",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#74539f">MindCare AI</h2>

        <p>Your password reset OTP is:</p>

        <h1 style="font-size:36px;letter-spacing:8px;color:#4b386d">
          ${otp}
        </h1>

        <p>This OTP is valid for 10 minutes.</p>

        <p>If you did not request a password reset, you can ignore this email.</p>

        <p>Regards,<br>
        <strong>MindCare AI Team</strong></p>
      </div>
    `,
  });
}


// FEEDBACK NOTIFICATION
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
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#74539f">
          New MindCare AI Feedback
        </h2>

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
  sendOTP,
  sendResetOTP,
  sendFeedbackNotification,
};