import * as messageRepository from '../repositories/messageRepository.js';

export const createMessage = (payload) => messageRepository.createMessage(payload);
export const listMessages = () => messageRepository.listMessages();

