const sendEmail = require("./email.config.js");

function sendVerificationEmail(to, otp) {
  const subject = "🔐 Verify Your Account - MakeMePro";
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #007BFF; text-align: center;">Email Verification</h2>
        <p>Dear User,</p>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <div style="font-size: 20px; font-weight: bold; text-align: center; background: #f3f3f3; padding: 10px; border-radius: 5px; margin: 10px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in <strong>10 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; color: #888;">MakeMePro Team</p>
      </div>
    `;
  return sendEmail(to, subject, htmlContent);
}

function sendWelcomeEmail(to, name) {
  const subject = "🎉 Welcome to MakeMePro!";
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #28a745; text-align: center;">Welcome, ${name}!</h2>
        <p>Dear ${name},</p>
        <p>We're thrilled to have you on board! At MakeMePro, we strive to provide the best experience for our users.</p>
        <p>Explore our platform and make the most of it. If you have any questions, feel free to reach out to us.</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; color: #888;">MakeMePro Team</p>
      </div>
    `;
  return sendEmail(to, subject, htmlContent);
}

function sendLoginEmail(to, name) {
  const subject = "🔓 Successful Login - MakeMePro";
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #17a2b8; text-align: center;">Hello, ${name}!</h2>
        <p>We noticed a login to your MakeMePro account.</p>
        <p>If this was you, no further action is needed. If you didn't log in, please secure your account immediately.</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; color: #888;">MakeMePro Team</p>
      </div>
    `;
  return sendEmail(to, subject, htmlContent);
}

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendLoginEmail };
