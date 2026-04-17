import { api } from './api.js';

export const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
};

export const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data.data;
};
