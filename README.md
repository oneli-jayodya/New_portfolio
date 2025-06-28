# New_portfolio
My portfolio including home, about, education, skills, projects, and contact us

## Email Setup with Nodemailer

The contact form uses Nodemailer to send emails. To set this up:

### 1. Environment Variables
Create a `.env.local` file (for local development) or set these variables in your Vercel dashboard:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=your-email@gmail.com
```

### 2. Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account settings > Security > App passwords
3. Generate a new app password for "Mail"
4. Use this app password (not your regular password) in `EMAIL_PASS`

### 3. Other Email Providers
If not using Gmail, update the transporter configuration in `api/contact.js` with your SMTP settings:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### 4. Vercel Deployment
Set the environment variables in your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `EMAIL_USER`, `EMAIL_PASS`, and `CONTACT_EMAIL`

## Features
- Responsive portfolio design
- Contact form with email notifications
- Project showcase
- Skills and education sections
