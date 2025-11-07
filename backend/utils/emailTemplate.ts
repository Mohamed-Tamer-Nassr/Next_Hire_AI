// ✅ CORRECTED: Remove unused parameter
export const resetPasswordHTMLTemplate = (
  userName: string,
  resetId: string // Only need the reset ID for the URL
): string => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/password/reset?id=${resetId}`;

  return `
   <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Reset Your Password - Next Hire AI</title>
    <style type="text/css" rel="stylesheet" media="all">
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }

      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }

      @keyframes glow {
        0%,
        100% {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3),
            0 0 40px rgba(139, 92, 246, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        }
        50% {
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5),
            0 0 60px rgba(139, 92, 246, 0.3), 0 6px 8px -1px rgba(0, 0, 0, 0.5);
        }
      }

      @keyframes slideIn {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        -webkit-text-size-adjust: none;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, Helvetica, Arial, sans-serif;
        animation: fadeInUp 0.8s ease-out;
      }

      a {
        color: #a78bfa;
        text-decoration: none;
      }

      a:hover {
        color: #ffffff;
        /* text-decoration: underline; */
      }

      a img {
        border: none;
      }

      td {
        word-break: break-word;
      }

      .preheader {
        display: none !important;
        visibility: hidden;
        mso-hide: all;
        font-size: 1px;
        line-height: 1px;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
      }

      h1 {
        margin: 0 0 24px;
        color: #ffffff;
        font-size: 32px;
        font-weight: 700;
        line-height: 1.3;
        letter-spacing: -0.02em;
        animation: fadeInUp 0.6s ease-out 0.2s both;
      }

      h2 {
        margin: 0 0 16px;
        color: #e5e7eb;
        font-size: 20px;
        font-weight: 600;
        line-height: 1.4;
      }

      p {
        margin: 0 0 16px;
        color: #d1d5db;
        font-size: 16px;
        line-height: 1.6;
        animation: fadeInUp 0.6s ease-out 0.3s both;
      }

      p.small {
        font-size: 14px;
        color: #9ca3af;
      }

      .button {
        display: inline-block;
        background: linear-gradient(
          135deg,
          #8b5cf6 0%,
          #a78bfa 50%,
          #8b5cf6 100%
        );
        background-size: 200% 100%;
        color: #000000 !important;
        font-size: 16px;
        font-weight: 700;
        text-decoration: none;
        padding: 18px 40px;
        border-radius: 12px;
        box-shadow: 0 0 20px rgba(139, 92, 246, 0.4),
          0 4px 6px -1px rgba(0, 0, 0, 0.5);
        transition: all 0.3s ease;
        animation: glow 2s ease-in-out infinite;
      }

      .button:hover {
        background-position: 100% 0;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 0 30px rgba(139, 92, 246, 0.6),
          0 10px 20px -5px rgba(0, 0, 0, 0.6);
        text-decoration: none;
      }

      @media only screen and (max-width: 600px) {
        .button {
          width: 100% !important;
          text-align: center !important;
          display: block !important;
          box-sizing: border-box !important;
          padding: 16px 20px !important;
        }

        .body-action {
          width: 100% !important;
        }

        .body-action table {
          width: 100% !important;
        }

        .email-body_inner,
        .email-footer {
          width: 100% !important;
        }

        .content-cell {
          padding: 32px 24px !important;
        }

        h1 {
          font-size: 26px !important;
        }
      }

      body {
        background-color: #000000;
        background-image: radial-gradient(
            circle at 20% 30%,
            rgba(139, 92, 246, 0.15) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at 80% 70%,
            rgba(167, 139, 250, 0.1) 0%,
            transparent 50%
          );
      }

      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: transparent;
      }

      .email-content {
        width: 100%;
        margin: 0;
        padding: 0;
      }

      .email-masthead {
        padding: 40px 0 32px;
        text-align: center;
        animation: fadeInUp 0.6s ease-out;
      }

      .email-masthead_logo {
        display: inline-block;
        padding: 14px 32px;
        background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
        border-radius: 12px;
        color: #000000;
        font-size: 22px;
        font-weight: 700;
        text-decoration: none;
        letter-spacing: -0.01em;
        box-shadow: 0 0 30px rgba(139, 92, 246, 0.5),
          0 4px 6px -1px rgba(0, 0, 0, 0.5);
        animation: pulse 3s ease-in-out infinite;
      }

      .email-body {
        width: 100%;
        margin: 0;
        padding: 0;
      }

      .email-body_inner {
        width: 600px;
        margin: 0 auto;
        padding: 0;
        background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: 16px;
        box-shadow: 0 0 50px rgba(139, 92, 246, 0.2),
          0 20px 40px -10px rgba(0, 0, 0, 0.8),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        overflow: hidden;
        animation: fadeInUp 0.8s ease-out 0.2s both;
      }

      .content-cell {
        padding: 48px;
        position: relative;
      }

      .content-cell::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
        animation: shimmer 3s infinite;
      }

      .security-banner {
        background: linear-gradient(
          135deg,
          rgba(139, 92, 246, 0.2) 0%,
          rgba(167, 139, 250, 0.15) 100%
        );
        padding: 16px 20px;
        border-left: 4px solid #8b5cf6;
        border-radius: 10px;
        margin: 24px 0;
        backdrop-filter: blur(10px);
        animation: slideIn 0.6s ease-out 0.5s both;
      }

      .security-banner p {
        margin: 0;
        color: #e9d5ff;
        font-size: 14px;
        font-weight: 500;
      }

      .security-banner .icon {
        display: inline-block;
        margin-right: 8px;
        font-weight: 700;
        animation: pulse 2s ease-in-out infinite;
      }

      .body-action {
        width: 100%;
        margin: 36px 0;
        padding: 0;
        text-align: center;
        animation: fadeInUp 0.6s ease-out 0.4s both;
      }

      .divider {
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(139, 92, 246, 0.5) 50%,
          transparent 100%
        );
        margin: 32px 0;
      }

      .info-box {
        background: rgba(139, 92, 246, 0.05);
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: 10px;
        padding: 20px;
        margin: 24px 0;
        backdrop-filter: blur(10px);
        animation: fadeInUp 0.6s ease-out 0.6s both;
      }

      .info-box p {
        margin: 0;
        font-size: 14px;
        color: #d1d5db;
        line-height: 1.5;
        animation: none;
      }

      .url-text {
        word-break: break-all;
        color: #a78bfa;
        font-size: 13px;
      }

      .email-footer {
        width: 600px;
        margin: 0 auto;
        padding: 32px 0 48px;
        text-align: center;
        animation: fadeInUp 0.8s ease-out 0.7s both;
      }

      .email-footer p {
        color: #6b7280;
        font-size: 14px;
        line-height: 1.6;
        margin: 4px 0;
      }

      .footer-links {
        margin: 16px 0 0;
      }

      .footer-links a {
        color: #9ca3af;
        font-size: 14px;
        margin: 0 12px;
        text-decoration: none;
        transition: all 0.3s ease;
      }

      .footer-links a:hover {
        color: #a78bfa;
        text-decoration: none;
        transform: translateY(-1px);
      }

      :root {
        color-scheme: dark;
      }
    </style>
  </head>
  <body>
    <span class="preheader"
      >Reset your Next Hire AI password. This link expires in 30 minutes.</span
    >
    <table
      class="email-wrapper"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
    >
      <tr>
        <td align="center">
          <table
            class="email-content"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
          >
            <!-- Header -->
            <tr>
              <td class="email-masthead">
                <a href="https://nexthireai.com" class="email-masthead_logo">
                  Next Hire AI
                </a>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                class="email-body"
                width="600"
                cellpadding="0"
                cellspacing="0"
              >
                <table
                  class="email-body_inner"
                  align="center"
                  width="600"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                >
                  <tr>
                    <td class="content-cell">
                      <div>
                        <h1>Password Reset Request</h1>
                        <p>
                          Hi
                          <strong style="color: #a78bfa">${userName}</strong>,
                        </p>
                        <p>
                          We received a request to reset the password for your
                          Next Hire AI account. Click the button below to create
                          a new password.
                        </p>

                        <!-- Security Notice -->
                        <div class="security-banner">
                          <p>
                            <span class="icon">⚠️</span> This link will expire
                            in 30 minutes for security reasons.
                          </p>
                        </div>

                        <!-- CTA Button -->
                        <table
                          class="body-action"
                          align="center"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                        >
                          <tr>
                            <td align="center">
                              <a
                                href="${resetUrl}"
                                class="button"
                                target="_blank"
                              >
                                Reset Your Password
                              </a>
                            </td>
                          </tr>
                        </table>

                        <div class="divider"></div>

                        <!-- Additional Info -->
                        <p class="small">
                          If you didn't request a password reset, you can safely
                          ignore this email. Your password will remain
                          unchanged.
                        </p>

                        <p class="small">
                          For security concerns or questions, please contact our
                          support team immediately.
                        </p>

                        <p style="margin-top: 32px; color: #e5e7eb">
                          Best regards,<br />
                          <strong style="color: #ffffff"
                            >The Next Hire AI Team</strong
                          >
                        </p>

                        <!-- Fallback URL -->
                        <div class="info-box">
                          <p>
                            <strong style="color: #ffffff"
                              >Having trouble with the button?</strong
                            ><br />Copy and paste this link into your browser:
                          </p>
                          <p class="url-text" style="margin-top: 8px">
                            ${resetUrl}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td>
                <table
                  class="email-footer"
                  align="center"
                  width="600"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                >
                  <tr>
                    <td align="center">
                      <p style="color: #9ca3af">
                        <strong>Next Hire AI</strong>
                      </p>
                      <p>1234 Street Rd., Suite 1234</p>
                      <div class="footer-links">
                        <a href="https://nexthireai.com/help">Help Center</a>
                        <a href="https://nexthireai.com/privacy"
                          >Privacy Policy</a
                        >
                        <a href="https://nexthireai.com/terms"
                          >Terms of Service</a
                        >
                      </div>
                      <p style="margin-top: 16px; font-size: 12px">
                        © 2025 Next Hire AI. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

  `;
};

// ✅ Email verification template
export const verificationEmailHTMLTemplate = (
  userName: string,
  verificationUrl: string
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Next Hire AI</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Next Hire AI!</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                  
                  <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    Hi <strong>${userName}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                    Thank you for signing up! Please verify your email address by clicking the button below:
                  </p>
                  
                  <!-- Button -->
                  <table role="presentation" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    Or copy and paste this link into your browser:
                  </p>
                  
                  <p style="margin: 0 0 20px 0; padding: 12px; background-color: #f5f5f5; border-radius: 4px; word-break: break-all; color: #667eea; font-size: 14px;">
                    ${verificationUrl}
                  </p>
                  
                  <!-- Info -->
                  <div style="margin: 30px 0; padding: 16px; background-color: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
                    <p style="margin: 0; color: #1565c0; font-size: 14px; line-height: 1.6;">
                      <strong>ℹ️ Note:</strong> This link will expire in <strong>24 hours</strong>.
                    </p>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                    If you didn't create an account, please ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                    © ${new Date().getFullYear()} Next Hire AI. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    Your AI-Powered Hiring Assistant
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
};
