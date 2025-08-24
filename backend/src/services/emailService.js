const nodemailer = require('nodemailer');

// Create transporter using environment variables
const createTransporter = async () => {
  // For development, we'll use Ethereal.email to simulate email sending
  // In production, you would use real SMTP credentials
  if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
    // Create a test account for Ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('Using Ethereal.email for development email simulation');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
  
  // Production SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send email notification for template download
const sendTemplateDownloadNotification = async (email, templateTitle, downloadType) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM_ADDRESS || 'no-reply@iacovici.it',
      to: email,
      subject: `Your ${templateTitle} Template is Ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Thank You for Downloading!</h2>
          
          <p>Hello,</p>
          
          <p>Thank you for downloading the <strong>${templateTitle}</strong> template from Iacovici.it.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Next Steps:</h3>
            <ul>
              <li>If you chose to copy the template, it's now in your clipboard</li>
              <li>If you chose to import, you should have been redirected to n8n</li>
              <li>If you're having any issues, please reply to this email for support</li>
            </ul>
          </div>
          
          <p>We hope this template helps you save time and automate your workflows!</p>
          
          <p>Best regards,<br>
          The Iacovici.it Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="font-size: 12px; color: #999;">
            This email was sent because you downloaded a template from Iacovici.it. 
            If you didn't request this, please contact us at contact@iacovici.it
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    // For development, log the preview URL
    if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error: error.message };
  }
};

// Send email notification for purchased template
const sendPurchasedTemplateNotification = async (email, templateTitle, amount) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM_ADDRESS || 'no-reply@iacovici.it',
      to: email,
      subject: `Thank You for Your Purchase - ${templateTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Purchase Confirmation</h2>
          
          <p>Hello,</p>
          
          <p>Thank you for purchasing the <strong>${templateTitle}</strong> template for €${amount}.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Your Template:</h3>
            <p><strong>${templateTitle}</strong></p>
            <p>You can now download and use this premium template in your n8n workflows.</p>
          </div>
          
          <p>We hope this template helps you achieve your automation goals!</p>
          
          <p>Best regards,<br>
          The Iacovici.it Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="font-size: 12px; color: #999;">
            This email was sent because you purchased a template from Iacovici.it. 
            If you didn't make this purchase, please contact us at contact@iacovici.it
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Purchase confirmation email sent successfully:', info.messageId);
    
    // For development, log the preview URL
    if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendTemplateDownloadNotification,
  sendPurchasedTemplateNotification
};