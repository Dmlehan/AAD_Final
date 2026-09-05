import apiClient from './client';

export const studentApi = {
  getAll: (params = {}) => apiClient.get('/students', { params }),
  getById: (id) => apiClient.get(`/students/${id}`),
  create: (data) => apiClient.post('/students', data),
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  toggleStatus: (id, active) => apiClient.patch(`/students/${id}/status`, null, { params: { active } }),
  addGuardian: (studentId, data) => apiClient.post(`/students/${studentId}/guardians`, data),
  detachGuardian: (studentId, guardianId) => apiClient.delete(`/students/${studentId}/guardians/${guardianId}`),
};

export default studentApi;
