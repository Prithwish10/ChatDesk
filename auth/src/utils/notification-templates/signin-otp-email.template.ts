// OTP Email
export const signinOtpEmailSubject = 'Your ChatDesk Login OTP';

export const signinOtpEmailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your ChatDesk Login OTP</title>
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
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #0056b3;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your ChatDesk Login OTP</h1>
        <p>Hi [User's First Name],</p>
        <p>You’re just one step away from accessing your ChatDesk account. Use the one-time password (OTP) below to log in:</p>
        <div class="otp">[XXXXXX]</div>
        <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone to ensure your account's security.</p>
        <p>If you didn’t request this, please contact our support team immediately.</p>
        <p>Happy chatting,</p>
        <p>The ChatDesk Team</p>
    </div>
</body>
</html>
`;
