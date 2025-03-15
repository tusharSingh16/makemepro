const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "traininghorizonco@gmail.com",
    pass: "hqgq vhia xxez gijr",
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email body in HTML formatx
 */
async function sendEmail(to, subject, htmlContent) {
  try {
    const info = await transporter.sendMail({
      from: "traininghorizonco@gmail.com",
      to,
      subject,
      html: htmlContent,
    });
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmail;