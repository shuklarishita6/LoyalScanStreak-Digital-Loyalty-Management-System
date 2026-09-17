import api from './api';

export const getMyNotifications = () => api.get('/notifications').then((res) => res.data);
export const markNotificationsRead = () => api.patch('/notifications/read-all').then((res) => res.data);
