import * as messageRepository from '../repositories/messageRepository.js';
import { sendMail } from '../utils/mailer.js';
import { env } from '../config/env.js';

export const createMessage = async (payload) => {
  const created = await messageRepository.createMessage(payload);
  await sendMail({
    to: env.adminNotificationEmail,
    subject: `New contact message — ${payload.name}`,
    text: `${payload.name} <${payload.email}> wrote:\n\n${payload.message}`,
    html: `<p><strong>${payload.name}</strong> &lt;${payload.email}&gt;</p>
           <p>${payload.message.replace(/\n/g, '<br/>')}</p>`,
  });
  return created;
};

export const listMessages = () => messageRepository.listMessages();
