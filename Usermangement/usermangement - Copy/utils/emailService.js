const nodemailer = require('nodemailer');

// Function to send email notification
async function sendNotificationEmail(email, subject, message) {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', // Update with your SMTP host
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@example.com', // Update with your SMTP username
        pass: 'your password' // Update with your SMTP password
      }
    });

    let info = await transporter.sendMail({
      from: 'your-email@example.com',
      to: email,
      subject: subject,
      text: message
    });

    console.log("Message sent: %s", info.messageId);
    return true; // Email sent successfully
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Failed to send email
  }
}




// Function to send email notification to admin
async function sendAdminNotification(subject, message) {
  const adminEmails = ['admin@example.com']; // Add admin email addresses
  for (const email of adminEmails) {
    const success = await sendNotificationEmail(email, subject, message);
    if (!success) {
      // Handle failure to send email to admin
      console.error(`Failed to send email notification to admin: ${email}`);
    }
  }
}

module.exports = { sendNotificationEmail, sendAdminNotification };
