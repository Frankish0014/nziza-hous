import * as messageRepository from '../repositories/messageRepository.js';
import { sendMail, isSmtpConfigured } from '../utils/mailer.js';
import { env } from '../config/env.js';
import { ensureDbReady } from '../ensureDb.js';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function adminMail(payload) {
  return {
    to: env.adminNotificationEmail,
    subject: `New contact message — ${payload.name}`,
    text: `${payload.name} <${payload.email}> wrote:\n\n${payload.message}`,
    html: `<p><strong>${escapeHtml(payload.name)}</strong> &lt;${escapeHtml(payload.email)}&gt;</p>
<p>${escapeHtml(payload.message).replace(/\n/g, '<br/>')}</p>`,
    replyTo: payload.email,
  };
}

function userThankYouMail(payload) {
  const site = (env.siteUrl || '').replace(/\/$/, '');
  const siteLine = site
    ? `You can always visit <a href="${escapeHtml(site)}">${escapeHtml(site)}</a>.`
    : 'We will reply using the email address you provided.';
  return {
    to: payload.email,
    subject: 'Thank you for contacting Nziza House',
    text: `Hi ${payload.name},

Thank you for reaching out to Nziza House. We have received your message and our team will review it and respond as soon as we can.

${site ? `Website: ${site}\n` : ''}
Warm regards,
Nziza House`,
    html: `<p>Hi ${escapeHtml(payload.name)},</p>
<p>Thank you for reaching out to <strong>Nziza House</strong>. We have received your message and our team will review it and respond as soon as we can.</p>
<p>${siteLine}</p>
<p>Warm regards,<br/>Nziza House</p>`,
  };
}

async function tryPersist(payload) {
  if (env.skipDatabaseBootstrap) return null;
  try {
    await ensureDbReady();
    return await messageRepository.createMessage(payload);
  } catch (err) {
    console.warn('[messages] could not save to database:', err?.message || err);
    return null;
  }
}

async function sendContactEmails(payload) {
  const adminResult = await sendMail(adminMail(payload));
  if (!adminResult.ok) {
    const err = new Error(
      adminResult.skipped
        ? 'Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS (e.g. in Vercel → Environment Variables).'
        : adminResult.error || 'Could not send notification email',
    );
    err.status = adminResult.skipped ? 503 : 502;
    throw err;
  }
  const userResult = await sendMail(userThankYouMail(payload));
  if (!userResult.ok && !userResult.skipped) {
    console.warn('[messages] thank-you email to visitor failed:', userResult.error);
  }
}

/**
 * Public contact form: saves to Postgres when available; sends team + visitor emails when SMTP is set.
 * On Vercel without a database URL, email-only delivery works if SMTP_* variables are configured.
 */
export const submitPublicContactMessage = async (payload) => {
  const created = await tryPersist(payload);

  if (isSmtpConfigured()) {
    await sendContactEmails(payload);
  } else if (!created) {
    const err = new Error(
      'Contact form is unavailable: add a Postgres URL (DATABASE_URL / POSTGRES_URL) or configure SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS).',
    );
    err.status = 503;
    throw err;
  }

  return (
    created || {
      id: null,
      name: payload.name,
      email: payload.email,
      message: payload.message,
      delivered_via: 'email',
      created_at: new Date().toISOString(),
    }
  );
};

/** @deprecated Use submitPublicContactMessage — kept for Express `messageController` parity. */
export const createMessage = submitPublicContactMessage;

export const listMessages = () => messageRepository.listMessages();
