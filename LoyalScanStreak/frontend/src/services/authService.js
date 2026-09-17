import api from './api';

export const registerCustomer = (data) => api.post('/customers/register', data).then((res) => res.data);
export const loginCustomer = (data) => api.post('/customers/login', data).then((res) => res.data);

export const registerOwner = (data) => api.post('/owners/register', data).then((res) => res.data);
export const loginOwner = (data) => api.post('/owners/login', data).then((res) => res.data);
