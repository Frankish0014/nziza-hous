import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const hasSmtpConfig = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

export const isSmtpConfigured = () => hasSmtpConfig;

const isGmail = env.smtp.host === 'smtp.gmail.com';

function bareEmail(fromHeader) {
  if (!fromHeader || typeof fromHeader !== 'string') return '';
  const m = fromHeader.match(/<([^>]+)>/);
  return (m ? m[1] : fromHeader).trim().toLowerCase();
}

/** Gmail often rejects or misroutes when From ≠ authenticated mailbox. Prefer a verified sender. */
function resolveFromAddress() {
  const configured = env.fromEmail || env.smtp.user || '';
  if (!hasSmtpConfig) return configured;
  const authUser = (env.smtp.user || '').trim().toLowerCase();
  if (isGmail && authUser) {
    const fromBare = bareEmail(configured);
    if (fromBare && fromBare !== authUser) {
      // eslint-disable-next-line no-console
      console.warn(
        '[mail] FROM_EMAIL does not match SMTP_USER for Gmail; sending as SMTP_USER for reliable delivery.',
      );
      return `Nziza House <${env.smtp.user}>`;
    }
  }
  return configured;
}

function recipientLooksInvalid(err) {
  const code = err?.responseCode;
  if (code === 550 || code === 551 || code === 553 || code === 554) return true;
  const msg = String(err?.message || err?.response || '').toLowerCase();
  return /user unknown|invalid recipient|mailbox unavailable|no such user|address rejected/.test(msg);
}

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      ...(isGmail && env.smtp.port === 587 ? { requireTLS: true } : {}),
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    })
  : null;

export const sendMail = async ({ to, subject, text, html, replyTo }) => {
  if (!transporter) {
    console.log(`[MAIL-DRY-RUN] to=${to} subject="${subject}"`);
    return { ok: false, skipped: true };
  }
  const toAddr = typeof to === 'string' ? to.trim() : to;
  try {
    await transporter.sendMail({
      from: resolveFromAddress(),
      to: toAddr,
      subject,
      text,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    return { ok: true };
  } catch (e) {
    console.error('[mail] send failed:', e?.message || e);
    return {
      ok: false,
      error: e?.message || String(e),
      recipientLikelyInvalid: recipientLooksInvalid(e),
    };
  }
};
