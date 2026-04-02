import * as bookingRepository from '../repositories/bookingRepository.js';
import * as serviceRepository from '../repositories/serviceRepository.js';
import { sendMail } from '../utils/mailer.js';
import { env } from '../config/env.js';

export const createBooking = async (payload) => {
  try {
    const created = await bookingRepository.createBooking(payload);
    const service = await serviceRepository.getServiceById(Number(payload.serviceId));
    const serviceLabel = service?.name || `Service #${payload.serviceId}`;

    if (payload.email) {
      await sendMail({
        to: payload.email,
        subject: `Booking submitted — ${serviceLabel} · Nziza House`,
        text: `Hello ${payload.fullName || 'Guest'}, your ${serviceLabel} booking request has been submitted and is pending confirmation.`,
        html: `<p>Hello ${payload.fullName || 'Guest'},</p>
               <p>Your request for <strong>${serviceLabel}</strong> has been submitted and is <strong>pending confirmation</strong>.</p>
               <p>Date: <strong>${payload.bookingDate}</strong> | Time: <strong>${payload.timeSlot}</strong></p>
               <p>We will contact you shortly to confirm payment and booking status.</p>`,
      });
    }

    await sendMail({
      to: env.adminNotificationEmail,
      subject: `New booking — ${serviceLabel} · Nziza House`,
      text: `New booking from ${payload.fullName || 'Guest'} (${payload.email || 'no email'}) for ${serviceLabel}`,
      html: `<p>New booking request received.</p>
             <p><strong>Service:</strong> ${serviceLabel}</p>
             <p><strong>Name:</strong> ${payload.fullName || '-'}</p>
             <p><strong>Email:</strong> ${payload.email || '-'}</p>
             <p><strong>Phone:</strong> ${payload.phone || '-'}</p>
             <p><strong>Date:</strong> ${payload.bookingDate}</p>
             <p><strong>Time Slot:</strong> ${payload.timeSlot}</p>
             <p><strong>Payment Method:</strong> ${payload.paymentMethod || '-'}</p>
             <p><strong>Payment Proof:</strong> ${payload.paymentProofUrl || '-'}</p>`,
    });

    return created;
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
  if (!booking?.email) return;
  const svc = booking.service_name || 'your experience';
  await sendMail({
    to: booking.email,
    subject: `Booking ${booking.status} — ${svc} · Nziza House`,
    text: `Your booking for ${svc} is now ${booking.status}.`,
    html: `<p>Hello ${booking.full_name || 'Guest'},</p>
           <p>Your booking for <strong>${svc}</strong> is now: <strong>${booking.status}</strong>.</p>
           <p>We look forward to hosting you at Nziza House.</p>`,
  });
};

