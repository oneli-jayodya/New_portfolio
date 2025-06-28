import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation (same logic as your PHP)
    const errors = [];
    
    if (!name || name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long.");
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please provide a valid email address.");
    }
    
    if (!subject || subject.trim().length < 3) {
      errors.push("Subject must be at least 3 characters long.");
    }
    
    if (!message || message.trim().length < 10) {
      errors.push("Message must be at least 10 characters long.");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(' ')
      });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use 'smtp' for custom SMTP
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password (not regular password)
      },
    });

    // Alternative SMTP configuration (uncomment if not using Gmail):
    /*
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST, // e.g., 'smtp.your-provider.com'
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    */

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER, // Where to receive contact emails
      subject: `Portfolio Contact: ${subject.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name.trim()}</p>
            <p><strong>Email:</strong> ${email.trim()}</p>
            ${phone?.trim() ? `<p><strong>Phone:</strong> ${phone.trim()}</p>` : ''}
            <p><strong>Subject:</strong> ${subject.trim()}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #666;">${message.trim().replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; font-size: 12px; color: #888;">
              <strong>Submission Details:</strong><br>
              Time: ${new Date().toLocaleString()}<br>
              IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}<br>
              User Agent: ${req.headers['user-agent']}
            </p>
          </div>
        </div>
      `,
      replyTo: email.trim(), // Allow direct reply to the sender
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('Contact form submission sent via email:', {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      subject: subject.trim(),
      timestamp: new Date().toISOString(),
    });

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. I will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Check if it's an email-related error
    if (error.code === 'EAUTH' || error.code === 'ENOTFOUND') {
      return res.status(500).json({
        success: false,
        message: 'Email service is currently unavailable. Please try again later or contact me directly.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
}
