// src/resend/templates/welcome-template.ts

export const welcomeEmailTemplate = (name: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1d29; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; background-color: #1a1d29;">
              <h1 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: 600; line-height: 1.3;">
                Welcome to WYTU Library, Your Learning Companion!
              </h1>
              <p style="margin: 0 0 15px 0; color: #b8b9bc; font-size: 16px; line-height: 1.5;">
                Hi ${name},
              </p>
              <p style="margin: 0 0 20px 0; color: #b8b9bc; font-size: 15px; line-height: 1.6;">
                Welcome to University Library! We're excited to have you join our community of book enthusiasts. Explore a wide range of books, borrow with ease, and manage your reading journey seamlessly.
              </p>
              <p style="margin: 0 0 30px 0; color: #b8b9bc; font-size: 15px; line-height: 1.6;">
                Get started by logging in to your account:
              </p>
              <!-- Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 0;">
              </table>
              <!-- Footer text -->
              <p style="margin: 30px 0 0 0; color: #b8b9bc; font-size: 14px; line-height: 1.5;">
                Happy reading,<br>
                The WYTU Library Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;