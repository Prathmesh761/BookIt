const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send confirmation email
const sendBookingConfirmation = async (booking) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.customerEmail,
      subject: 'Booking Confirmation - Bookit',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6;">Booking Confirmation</h2>
          <p>Dear ${booking.customerName},</p>
          <p>Thank you for your booking. Here are your booking details:</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #4b5563;">${booking.experienceTitle}</h3>
            <p><strong>Category:</strong> ${booking.experienceCategory}</p>
            <p><strong>Date:</strong> ${booking.selectedDate}</p>
            <p><strong>Time:</strong> ${booking.selectedSlot}</p>
            <p><strong>Price:</strong> ₹${booking.experiencePrice.toLocaleString('en-IN')}</p>
          </div>
          
          <p>If you have any questions, please contact our support team.</p>
          <p>Thank you for choosing Bookit!</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendBookingConfirmation };