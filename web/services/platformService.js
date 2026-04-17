import { api } from './api.js';

export const getServices = async () => (await api.get('/services')).data.data;

export const getServiceById = async (id) => (await api.get(`/services/${id}`)).data.data;

export const getServiceAvailability = async (serviceId, { from, to } = {}) => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  const { data } = await api.get(`/services/${serviceId}/availability`, { params });
  return data.data;
};

export const createService = async (payload) => (await api.post('/services', payload)).data.data;
export const updateService = async (id, payload) => (await api.put(`/services/${id}`, payload)).data.data;
export const deleteService = async (id) => (await api.delete(`/services/${id}`)).data;

export const getBookings = async (email) =>
  (await api.get('/bookings', { params: email ? { email } : {} })).data.data;
export const createBooking = async (payload) => (await api.post('/bookings', payload)).data.data;
export const updateBookingStatus = async (id, status) =>
  (await api.put(`/bookings/${id}`, { status })).data.data;

export const uploadPaymentProof = async (file) => {
  const formData = new FormData();
  formData.append('proof', file);
  const { data } = await api.post('/bookings/upload-proof', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const createMessage = async (payload) => (await api.post('/messages', payload)).data.data;
export const getMessages = async () => (await api.get('/messages')).data.data;
export const addMedia = async (payload) => (await api.post('/media', payload)).data.data;

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const getAnalytics = async () => (await api.get('/admin/analytics')).data.data;
export const getUsers = async () => (await api.get('/admin/users')).data.data;
