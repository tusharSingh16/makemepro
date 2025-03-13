import sendEmail from "./email.config.js";

function sendVerificationEmail(to, otp) {
    const subject = "Verify Your Account";
    const htmlContent = `
      <h2>Email Verification</h2>
      <p>Your OTP for verification is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you did not sign up, please ignore this email.</p>
    `;
    return sendEmail(to, subject, htmlContent);
  }
  
  
//   sendVerificationEmail("deevangkumawat56@gmail.com", "000111"); // Sends OTP email
function sendWelcomeEmail(to, name) {
    const subject = "Welcome to Our Platform!";
    const htmlContent = `
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for signing up. We're excited to have you on board!</p>
    `;
    return sendEmail(to, subject, htmlContent);
  }
  
  function sendLoginEmail(to, name) {
    const subject = "Welcome to Our Platform!";
    const htmlContent = `
      <h2>Welcome, ${name}!</h2>
      <p>You've been logged into your MakeMePro account</p>
`;
    return sendEmail(to, subject, htmlContent);
  }

    export { sendVerificationEmail, sendWelcomeEmail, sendLoginEmail };