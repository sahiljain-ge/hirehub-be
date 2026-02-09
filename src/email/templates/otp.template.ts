const otpTemplate = (otp: string) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #c1c4c7; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 0px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 20px; text-align: center; background-color: #309689;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">HireHub</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px; line-height: 1.6;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
              <p style="font-size: 16px; margin-bottom: 30px;">Thank you for choosing <b>HireHub</b>. To complete your registration and secure your account, please enter the following code. For your security, it will <span style="color:red">expire in 5 minutes</span>.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffffff; background-color: #309689; border: 1px dashed #4A90E2; border-radius: 4px;">
                  ${otp}
                </span>
              </div>

              <p style="font-size: 14px; color: #777; margin-top: 30px;">
                If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 12px; color: #aaa; background-color: #f9f9f9;">
              &copy; 2026 HireHub. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
export default otpTemplate;
