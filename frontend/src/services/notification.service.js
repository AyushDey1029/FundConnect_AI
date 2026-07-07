import apiClient from './apiClient';

export const notificationService = {
  getNotifications: async () => {
    const response = await apiClient.get('/notifications');
    return response.data.data.notifications;
  },

  markAsRead: async (id) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  }
};
