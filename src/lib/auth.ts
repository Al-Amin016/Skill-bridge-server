import { betterAuth, email } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import config from "../config";
import nodemailer from "nodemailer"


// mail sender
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: `${config.app_user}`,
    pass: `${config.app_pass}`,
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    trustedOrigins:[config.app_url!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "STUDENT",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
      console.log({user, url, token});
      const verificationUrl = `${config.app_user}/verify-email?token=${token}`
    try {
       const info = await transporter.sendMail({
    from: '"Prisma Foo Koch" <prismablog@email>',
    to: user.email,
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }
    .header {
      background-color: #2563eb;
      padding: 24px;
      text-align: center;
      color: #ffffff;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }
    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }
    .verify-button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      padding: 20px;
      font-size: 13px;
      color: #777777;
      text-align: center;
      background-color: #f9fafb;
    }
    .link {
      word-break: break-all;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>

    <div class="content">
      <p>Hello ${user.name} 👋,</p>

      <p>
        Thank you for creating an account with <strong>Prisma Blog</strong>.
        Please verify your email address by clicking the button below.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p class="link">${url}</p>

      <p>
        This verification link will expire in <strong>24 hours</strong>.
      </p>

      <p>
        If you did not create this account, you can safely ignore this email.
      </p>

      <p>
        Regards,<br />
        <strong>Prisma Blog Team</strong>
      </p>
    </div>

    <div class="footer">
      © 2026 Prisma Blog. All rights reserved.
    </div>
  </div>
</body>
</html>
`,
  });
    } catch (err) {
    console.error(err)
    throw err
    }
    console.log(`************verification email send!`);
    },
  },
      socialProviders: {
        google: { 
            prompt: "select_account consent",
            accessType: "offline", 
            clientId: config.google_client_id as string, 
            clientSecret: config.google_client_secret as string, 
        }, 
    },
});

