<?php
// Set content type for JSON response
header('Content-Type: application/json');

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate input data
    $name    = trim(htmlspecialchars($_POST['name'] ?? ''));
    $email   = trim(filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL));
    $phone   = trim(htmlspecialchars($_POST['phone'] ?? ''));
    $subject = trim(htmlspecialchars($_POST['subject'] ?? ''));
    $message = trim(htmlspecialchars($_POST['message'] ?? ''));

    // Validation
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = "Name must be at least 2 characters long.";
    }
    
    if (!$email) {
        $errors[] = "Please provide a valid email address.";
    }
    
    if (empty($subject) || strlen($subject) < 3) {
        $errors[] = "Subject must be at least 3 characters long.";
    }
    
    if (empty($message) || strlen($message) < 10) {
        $errors[] = "Message must be at least 10 characters long.";
    }

    // If there are validation errors, return them
    if (!empty($errors)) {
        echo json_encode([
            'success' => false,
            'message' => implode(' ', $errors)
        ]);
        exit;
    }

    // Email configuration
    $to = "ojwijesinghe@gmail.com"; // Replace with your actual email address
    $email_subject = "Portfolio Contact: " . $subject;
    
    // Email headers
    $headers = [];
    $headers[] = "From: Portfolio Contact <no-reply@yourdomain.com>";
    $headers[] = "Reply-To: $name <$email>";
    $headers[] = "Content-Type: text/html; charset=UTF-8";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    
    // Email body (HTML format)
    $email_body = "
    <html>
    <head>
        <title>New Contact Form Submission</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(45deg, #4827a7, #6c5ce7); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #4827a7; }
            .value { margin-top: 5px; padding: 10px; background: white; border-left: 4px solid #6c5ce7; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
                <p>From your portfolio website</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Name:</div>
                    <div class='value'>$name</div>
                </div>
                <div class='field'>
                    <div class='label'>Email:</div>
                    <div class='value'>$email</div>
                </div>";
    
    if (!empty($phone)) {
        $email_body .= "
                <div class='field'>
                    <div class='label'>Phone:</div>
                    <div class='value'>$phone</div>
                </div>";
    }
    
    $email_body .= "
                <div class='field'>
                    <div class='label'>Subject:</div>
                    <div class='value'>$subject</div>
                </div>
                <div class='field'>
                    <div class='label'>Message:</div>
                    <div class='value'>" . nl2br($message) . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This email was sent from the contact form on your portfolio website.</p>
                <p>Sent on: " . date('Y-m-d H:i:s') . "</p>
            </div>
        </div>
    </body>
    </html>";

    // Send email
    $mail_sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));
    
    if ($mail_sent) {
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully. I will get back to you soon.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, there was an error sending your message. Please try again later or contact me directly.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
}
?>