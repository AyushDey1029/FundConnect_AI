import apiClient from './apiClient';

export const adminService = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data.data;
  },
  getCampaigns: async () => {
    const response = await apiClient.get('/admin/campaigns');
    return response.data.data.campaigns;
  },
  approveCampaign: async (id) => {
    const response = await apiClient.patch(`/admin/campaigns/${id}/verify`);
    return response.data.data.campaign;
  },
  rejectCampaign: async (id) => {
    const response = await apiClient.patch(`/admin/campaigns/${id}/reject`);
    return response.data.data.campaign;
  },
  deleteCampaign: async (id) => {
    const response = await apiClient.delete(`/admin/campaigns/${id}`);
    return response.data.data;
  },
  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data.data.users;
  },
  banUser: async (id) => {
    const response = await apiClient.patch(`/admin/users/${id}/ban`);
    return response.data.data.user;
  },
  unbanUser: async (id) => {
    const response = await apiClient.patch(`/admin/users/${id}/unban`);
    return response.data.data.user;
  },
  getReports: async () => {
    const response = await apiClient.get('/admin/reports');
    return response.data.data.reports;
  },
  resolveReport: async (id) => {
    const response = await apiClient.patch(`/admin/reports/${id}/resolve`);
    return response.data.data.report;
  }
};
