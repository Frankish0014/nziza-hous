import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const hasSmtpConfig = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    })
  : null;

export const sendMail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    // eslint-disable-next-line no-console
    console.log(`[MAIL-DRY-RUN] to=${to} subject="${subject}"`);
    return;
  }
  await transporter.sendMail({
    from: env.fromEmail,
    to,
    subject,
    text,
    html,
  });
};

