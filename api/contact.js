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

    // For now, we'll log the data and simulate success
    // You can integrate with email services like SendGrid, Resend, or Nodemailer later
    console.log('Contact form submission:', {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    // TODO: Add actual email sending logic here
    // Example integrations:
    // 1. SendGrid API
    // 2. Resend API  
    // 3. Nodemailer with SMTP
    // 4. EmailJS (client-side alternative)

    // Simulate successful response
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. I will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
}
