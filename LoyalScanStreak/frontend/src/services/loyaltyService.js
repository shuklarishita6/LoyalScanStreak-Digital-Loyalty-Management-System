import api from './api';

export const updateLoyalty = (customerId) =>
  api.post('/loyalty/update', { customerId }).then((res) => res.data);

export const getLoyaltyHistory = (customerId) =>
  api.get(`/loyalty/history/${customerId}`).then((res) => res.data);
