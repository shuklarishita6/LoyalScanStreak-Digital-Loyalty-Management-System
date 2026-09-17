import api from './api';

export const getMyProfile = () => api.get('/customers/profile').then((res) => res.data);

export const getAllCustomers = (search = '') =>
  api.get(`/customers?search=${encodeURIComponent(search)}`).then((res) => res.data);

export const lookupCustomer = (customerId) =>
  api.get(`/customers/lookup/${customerId}`).then((res) => res.data);
