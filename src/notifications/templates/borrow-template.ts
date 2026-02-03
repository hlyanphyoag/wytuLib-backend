export interface BookBorrowedData {
  studentName: string;
  email?: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  viewBooksUrl?: string;
}

export const bookBorrowedTemplate = (data: BookBorrowedData): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Borrowed Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fafafa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px 40px; text-align: center; background-color: #ffffff;">
              <img src="https://ik.imagekit.io/bggbwoixo/wytuLib-images/Emblem_of_West_Yangon_Technological_University.svg?tr=f-png,w-273, h-360" alt="WYTU Library" style="display: block; margin: 0 auto 24px; width: 120px; height: 150px;" />
              
              <h1 style="color: #1a1a1a; margin: 0 0 8px; font-size: 26px; font-weight: 600;">Book Borrowed Successfully</h1>
              <p style="color: #737373; margin: 0; font-size: 14px;">West Yangon Technological University Library</p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #e5e5e5;"></div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin: 0 0 6px;">Dear <strong>${data.studentName}</strong>,</p>
              
              <p style="color: #525252; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
                You have successfully borrowed the following book from our library. Please review the details below:
              </p>
              
              <!-- Book Details Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                <tr>
                  <td style="background-color: #fafafa; border-radius: 8px; padding: 28px 24px;">
                    
                    <!-- Book Title -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <p style="color: #737373; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Book Title</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="color: #1a1a1a; font-size: 16px; margin: 0; font-weight: 600; line-height: 1.4;">${data.bookTitle}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Dates Row -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="width: 50%; padding-right: 12px; vertical-align: top;">
                          <p style="color: #737373; font-size: 13px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Borrowed On</p>
                          <p style="color: #1a1a1a; font-size: 15px; margin: 0; font-weight: 500;">${data.borrowDate}</p>
                        </td>
                        <td style="width: 50%; padding-left: 12px; vertical-align: top;">
                          <p style="color: #737373; font-size: 13px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Due Date</p>
                          <p style="color: #dc2626; font-size: 15px; margin: 0; font-weight: 600;">${data.dueDate}</p>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
              </table>
              
              ${data.viewBooksUrl ? `
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <a href="${data.viewBooksUrl}" style="display: inline-block; padding: 14px 28px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px;">
                      View My Books
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- Notice -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #fef3c7; border-radius: 6px; padding: 16px 20px;">
                    <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.5;">
                      <strong style="font-weight: 600;">Please Note:</strong> Remember to return the book by the due date to avoid late fees.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #525252; font-size: 14px; line-height: 1.6; margin: 0;">
                Thank you for using our library. If you need any assistance, feel free to contact us.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 32px 40px; text-align: center;">
              <p style="color: #1a1a1a; font-size: 14px; margin: 0 0 4px; font-weight: 500;">
                WYTU Library Team
              </p>
              <p style="color: #737373; font-size: 13px; margin: 0 0 16px;">
                West Yangon Technological University
              </p>
              <p style="color: #a3a3a3; font-size: 12px; margin: 0; line-height: 1.5;">
                This is an automated message. Please do not reply to this email.
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