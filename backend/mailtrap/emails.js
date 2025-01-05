const sendEmail = require('./emailService');
const nodemailer = require('nodemailer');
const { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_TEMPLATE } = require('./emailTemplates');

const sendVerificationEmail = async (email, verificationToken) => {
  const message = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);

  try {
    await sendEmail({
      email,
      subject: "Verify your email",
      message,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

const sendWelcomeEmail = async (email, name) => {
  const message = WELCOME_TEMPLATE.replace("{userName}", name);

  try {
    await sendEmail({
      email,
      subject: "Welcome to EBuy",
      message,
    });

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  const message = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

  try {
    await sendEmail({
      email,
      subject: "Reset your password",
      message,
    });
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

const sendResetSuccessEmail = async (email) => {
  const message = PASSWORD_RESET_SUCCESS_TEMPLATE;

  try {
    await sendEmail({
      email,
      subject: "Password Reset Successful",
      message,
    });

    console.log("Password reset success email sent successfully");
  } catch (error) {
    console.error("Error sending password reset success email", error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
