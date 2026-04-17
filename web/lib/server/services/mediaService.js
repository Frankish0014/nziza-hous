import * as mediaRepository from '../repositories/mediaRepository.js';

export const addMedia = (payload) => mediaRepository.addMedia(payload);
export const listMediaForService = (serviceId) => mediaRepository.listMediaForService(serviceId);

