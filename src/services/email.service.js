require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Bank Backend" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


/**
 * - Registration Email Service
 */
async function sendRegisterationEmail(userEmail, name) {
    const subject = "Welcome to our bank";
    const text = ``;
    const html = `<body style="margin:0; padding:0; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" 
          style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
          
          <!-- Header -->
          <tr>
            <td style="background:#1e3a8a; padding:25px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:22px; letter-spacing:1px;">
                Our Bank
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px; color:#333333; font-size:16px; line-height:1.7;">
              
              <p style="margin-top:0; font-size:18px;">
                Hello <strong>${name}</strong>,
              </p>

              <p>
                Thank you for registering at our Bank.
                We're excited to have you on board!
              </p>

              <p style="margin-top:30px;">
                Best regards,<br>
                <strong>Our Bank Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6; padding:20px; text-align:center; font-size:12px; color:#6b7280;">
              © 2026 Our Bank. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>`
    await sendEmail(userEmail, subject, text, html)
}

module.exports = {
    sendRegisterationEmail
};
