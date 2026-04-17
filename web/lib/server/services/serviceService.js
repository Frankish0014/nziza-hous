import * as serviceRepository from '../repositories/serviceRepository.js';

export const createService = (payload) => serviceRepository.createService(payload);
export const updateService = (id, payload) => serviceRepository.updateService(id, payload);
export const deleteService = (id) => serviceRepository.deleteService(id);
export const listServices = () => serviceRepository.listServices();
export const getServiceById = (id) => serviceRepository.getServiceById(id);

