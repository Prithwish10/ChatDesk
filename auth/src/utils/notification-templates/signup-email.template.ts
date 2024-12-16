// Signup Email
export const signupEmailSubject = 'Welcome to ChatDesk! Let’s Get Started';

export const signupEmailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ChatDesk</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #0056b3;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #0056b3;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #004599;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to ChatDesk!</h1>
        <p>Hi [User's First Name],</p>
        <p>Thank you for signing up for ChatDesk! We're thrilled to have you on board.</p>
        <p>Your journey to seamless communication starts here. You can now log in and explore our platform designed to enhance your collaboration experience.</p>
        <p>If you have any questions or need assistance, our support team is ready to help.</p>
        <a href="[Insert Login URL]" class="button">Log In to ChatDesk</a>
        <p>Welcome aboard,</p>
        <p>The ChatDesk Team</p>
    </div>
</body>
</html>
`;
