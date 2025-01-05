const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>The EBuy Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>The EBuy Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;


const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>The EBuy Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const WELCOME_TEMPLATE=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to EBuy!</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #eaeaea;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      animation: slideIn 1s ease-out;
      border: 1px solid #ddd;
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .email-header {
      background-color: #4CAF50;
      padding: 40px;
      text-align: center;
      color: white;
      animation: fadeIn 1.5s ease;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .email-header h1 {
      margin: 0;
      font-size: 2.5em;
    }
    .email-header img {
      width: 60px;
      height: 60px;
      margin-bottom: 15px;
    }
    .email-body {
      padding: 30px;
      color: #333;
      animation: fadeIn 2s ease;
    }
    .email-body h2 {
      font-size: 2em;
      margin-bottom: 15px;
      color: #4CAF50;
    }
    .email-body p {
      font-size: 1.1em;
      color: #555;
      line-height: 1.6;
      margin: 10px 0;
    }
    .icon-row {
      display: flex;
      justify-content: space-between;
      margin: 30px 0;
    }
    .icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #4CAF50;
      transition: transform 0.3s;
      flex: 1;
      margin: 0 10px;
    }
    .icon:hover {
      transform: scale(1.1);
    }
    .icon img {
      width: 50px;
      height: 50px;
      margin-bottom: 10px;
      animation: bounce 2s infinite;
    }
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    .email-footer {
      text-align: center;
      padding: 20px;
      color: #888;
      font-size: 0.9em;
      background-color: #f9f9f9;
      border-top: 1px solid #ddd;
    }
    .email-footer a {
      color: #4CAF50;
      text-decoration: none;
      font-weight: bold;
    }
    .email-footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>

  <div class="email-container">
    
    <!-- Header Section -->
    <div class="email-header">
      <img src="https://img.icons8.com/fluency/96/000000/checked.png" alt="Welcome Icon">
      <h1>Welcome to EBuy!</h1>
    </div>
    
    <!-- Body Section -->
    <div class="email-body">
      <h2>Hello {userName}!</h2>
      <p>We're absolutely thrilled to have you join our EBuy family! Get ready to dive into an amazing world filled with incredible products, exclusive deals, and tailor-made experiences just for you.</p>

      <!-- Icon Row (Dynamic & Animated) -->
      <div class="icon-row">
        <div class="icon">
          <img src="https://img.icons8.com/fluency/48/000000/shopping-cart.png" alt="Shop Icon">
          <p>Exclusive Offers!</p>
        </div>
        <div class="icon">
          <img src="https://img.icons8.com/fluency/48/000000/gift.png" alt="Gift Icon">
          <p>Surprise Gifts!</p>
        </div>
        <div class="icon">
          <img src="https://img.icons8.com/fluency/48/000000/online-support.png" alt="Support Icon">
          <p>24/7 Support</p>
        </div>
      </div>

      <p>We can't wait for you to explore and enjoy your shopping experience. Keep an eye out for fantastic deals and surprises that will be heading your way soon!</p>

      <p>Happy Shopping!<br>The EBuy Team</p>
    </div>
    
    <!-- Footer Section -->
    <div class="email-footer">
      <p>Need assistance? We're here to help! Contact us at <a href="mailto:support@ebuy.com">support@ebuy.com</a>.</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
    
  </div>

</body>
</html>
`;

module.exports={
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    WELCOME_TEMPLATE
}