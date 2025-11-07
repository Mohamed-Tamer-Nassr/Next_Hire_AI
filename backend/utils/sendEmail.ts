import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export default async (options: EmailOptions) => {
  // Add validation
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error(
      "Email configuration is incomplete. Please check environment variables."
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10), // âœ… Convert to number
    secure: parseInt(process.env.SMTP_PORT, 10) === 465, // Use SSL for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify connection before sending
  try {
    await transporter.verify();
  } catch (error) {
    console.error("SMTP connection failed:", error);
    throw new Error(
      "Email service is currently unavailable. Please try again later."
    );
  }

  const message = {
    from: `${process.env.FORM_NAME} <${process.env.FORM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(message);
};
