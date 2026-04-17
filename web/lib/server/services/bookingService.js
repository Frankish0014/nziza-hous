import * as bookingRepository from '../repositories/bookingRepository.js';
import * as serviceRepository from '../repositories/serviceRepository.js';
import { sendMail, isSmtpConfigured } from '../utils/mailer.js';
import { env } from '../config/env.js';
import { isSlotPastForVenueDate } from '../utils/slotRules.js';

async function sendBookingMail(opts) {
  return sendMail(opts);
}

function adminBookingsReviewUrl() {
  const base = (env.siteUrl || env.publicBaseUrl || '').replace(/\/$/, '');
  return base ? `${base}/admin/bookings` : null;
}

async function assertBookableSlot(payload) {
  const tz = env.bookingTimeZone;
  const now = new Date();
  if (isSlotPastForVenueDate(payload.bookingDate, payload.timeSlot, now, tz)) {
    const err = new Error(
      'That time slot is no longer open for booking on this date. Please pick a later slot or another day.',
    );
    err.status = 400;
    throw err;
  }
  const taken = await bookingRepository.hasActiveBookingForSlot({
    serviceId: Number(payload.serviceId),
    bookingDate: payload.bookingDate,
    timeSlot: payload.timeSlot,
  });
  if (taken) {
    const err = new Error('That time slot is already booked. Please choose another slot.');
    err.status = 409;
    throw err;
  }
}

function normalizeBookingPayload(payload) {
  const email =
    typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : payload.email;
  return {
    ...payload,
    email,
    fullName: typeof payload.fullName === 'string' ? payload.fullName.trim() : payload.fullName,
    phone: typeof payload.phone === 'string' ? payload.phone.trim() : payload.phone,
  };
}

export const createBooking = async (rawPayload) => {
  try {
    const payload = normalizeBookingPayload(rawPayload);
    await assertBookableSlot(payload);
    const created = await bookingRepository.createBooking(payload);
    const service = await serviceRepository.getServiceById(Number(payload.serviceId));
    const serviceLabel = service?.name || `Service #${payload.serviceId}`;

    const smtpConfigured = isSmtpConfigured();
    let userEmailSent = false;
    let userEmailStatus = 'none';
    let recipientLikelyInvalid = false;
    let adminEmailSent = false;

    if (payload.email && smtpConfigured) {
      const guestResult = await sendBookingMail({
        to: payload.email,
        replyTo: env.adminNotificationEmail,
        subject: `Booking submitted — ${serviceLabel} · Nziza House`,
        text: `Hello ${payload.fullName || 'Guest'},

Thank you for choosing Nziza House.

Your booking request for ${serviceLabel} has been received and is pending confirmation.

Details:
• Date: ${payload.bookingDate}
• Time: ${payload.timeSlot}
• Payment method: ${payload.paymentMethod || '—'}

Our team will review your payment proof and confirm your reservation by email. If you have questions, reply to this message or use the contact page on our website.

— Nziza House`,
        html: `<p>Hello ${payload.fullName || 'Guest'},</p>
               <p>Thank you for choosing <strong>Nziza House</strong>.</p>
               <p>Your request for <strong>${serviceLabel}</strong> has been submitted and is <strong>pending confirmation</strong>.</p>
               <p><strong>Date:</strong> ${payload.bookingDate}<br/>
                  <strong>Time:</strong> ${payload.timeSlot}<br/>
                  <strong>Payment method:</strong> ${payload.paymentMethod || '—'}</p>
               <p>We will review your payment proof and confirm your reservation shortly. You can reply to this email if you need anything.</p>
               <p style="margin-top:1.5em;color:#555;font-size:0.95em;">— Nziza House</p>`,
      });
      userEmailSent = Boolean(guestResult?.ok);
      if (guestResult?.ok) userEmailStatus = 'sent';
      else {
        userEmailStatus = 'failed';
        recipientLikelyInvalid = Boolean(guestResult?.recipientLikelyInvalid);
      }
    } else if (payload.email && !smtpConfigured) {
      userEmailStatus = 'smtp_off';
    }

    const reviewUrl = adminBookingsReviewUrl();
    const adminText = `New booking — action needed

Guest: ${payload.fullName || 'Guest'}
Email: ${payload.email || '—'}
Phone: ${payload.phone || '—'}
Service: ${serviceLabel}
Date: ${payload.bookingDate}
Time: ${payload.timeSlot}
Payment: ${payload.paymentMethod || '—'}
Proof: ${payload.paymentProofUrl || '—'}

Please review payment proof and confirm or cancel this booking in the admin panel.
${reviewUrl ? `Open bookings: ${reviewUrl}` : 'Sign in to the site admin → Bookings to confirm.'}`;

    const adminHtml = `<p style="font-size:16px;font-weight:600;">New booking — please review</p>
             <p>A guest submitted a booking and payment proof. <strong>Confirm the booking</strong> after you verify payment.</p>
             <p><strong>Service:</strong> ${serviceLabel}<br/>
                <strong>Date:</strong> ${payload.bookingDate}<br/>
                <strong>Time:</strong> ${payload.timeSlot}</p>
             <p><strong>Name:</strong> ${payload.fullName || '-'}<br/>
                <strong>Email:</strong> ${payload.email || '-'}<br/>
                <strong>Phone:</strong> ${payload.phone || '-'}</p>
             <p><strong>Payment method:</strong> ${payload.paymentMethod || '-'}<br/>
                <strong>Payment proof:</strong> <a href="${payload.paymentProofUrl || '#'}">${payload.paymentProofUrl || '—'}</a></p>
             ${
               reviewUrl
                 ? `<p style="margin-top:20px;"><a href="${reviewUrl}" style="display:inline-block;padding:12px 20px;background:#c45c26;color:#fffaf5;text-decoration:none;border-radius:999px;font-weight:600;">Review &amp; confirm booking</a></p>
                    <p style="font-size:13px;color:#555;">If the button does not work, copy this link:<br/>${reviewUrl}</p>`
                 : '<p style="font-size:13px;color:#555;">Open your site’s Admin → Bookings to approve or cancel.</p>'
             }`;

    const adminResult = await sendBookingMail({
      to: env.adminNotificationEmail,
      subject: `[Action required] New booking — ${serviceLabel} · ${payload.bookingDate} ${payload.timeSlot}`,
      text: adminText,
      html: adminHtml,
    });
    adminEmailSent = Boolean(adminResult?.ok);

    return {
      ...created,
      emailNotification: {
        smtpConfigured,
        userEmailSent,
        userEmailStatus,
        recipientLikelyInvalid,
        adminEmailSent,
      },
    };
  } catch (err) {
    if (err.code === '23505') {
      const conflict = new Error('Time slot already booked for this service');
      conflict.status = 409;
      throw conflict;
    }
    throw err;
  }
};

export const listBookings = () => bookingRepository.listBookings();
export const listBookingsForUser = (userId) => bookingRepository.listBookingsForUser(userId);
export const listBookingsByEmail = (email) => bookingRepository.listBookingsByEmail(email);
export const updateBookingStatus = (id, status) => bookingRepository.updateBookingStatus(id, status);

export const sendBookingStatusEmail = async (booking) => {
  if (!booking?.email || !isSmtpConfigured()) return;
  const svc = booking.service_name || 'your experience';
  const name = booking.full_name || 'Guest';
  const date = booking.booking_date
    ? new Date(booking.booking_date).toISOString().slice(0, 10)
    : '';
  const slot = booking.time_slot || '';

  if (booking.status === 'confirmed') {
    await sendBookingMail({
      to: booking.email,
      subject: `You’re confirmed — ${svc} · Nziza House`,
      text: `Hello ${name},

Great news: your booking is confirmed.

${svc}
Date: ${date}
Time: ${slot}

We look forward to welcoming you at Nziza House. If you need to make a change, reply to this email.

— Nziza House`,
      html: `<p>Hello ${name},</p>
             <p><strong>Your booking is confirmed.</strong> Payment has been verified and your reservation is set.</p>
             <p><strong>${svc}</strong><br/>
                <strong>Date:</strong> ${date}<br/>
                <strong>Time:</strong> ${slot}</p>
             <p>We look forward to welcoming you at Nziza House. Reply to this email if you need anything.</p>
             <p style="margin-top:1.5em;color:#555;font-size:0.95em;">— Nziza House</p>`,
    });
    return;
  }

  if (booking.status === 'cancelled') {
    await sendBookingMail({
      to: booking.email,
      subject: `Booking update — ${svc} · Nziza House`,
      text: `Hello ${name},

Your booking request for ${svc} (${date}, ${slot}) has been cancelled.

If you believe this is a mistake, please contact us.

— Nziza House`,
      html: `<p>Hello ${name},</p>
             <p>Your booking request for <strong>${svc}</strong> on <strong>${date}</strong> at <strong>${slot}</strong> has been <strong>cancelled</strong>.</p>
             <p>If this was unexpected, reply to this email or use our contact page.</p>
             <p style="margin-top:1.5em;color:#555;font-size:0.95em;">— Nziza House</p>`,
    });
  }
};

