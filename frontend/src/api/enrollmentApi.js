import apiClient from './client';

export const enrollmentApi = {
  getAll: (params = {}) => apiClient.get('/enrollments', { params }),
  getById: (id) => apiClient.get(`/enrollments/${id}`),
  enroll: (data) => apiClient.post('/enrollments', data),
  updateStatus: (id, data) => apiClient.patch(`/enrollments/${id}/status`, data),
  delete: (id) => apiClient.delete(`/enrollments/${id}`),
};

export default enrollmentApi;
