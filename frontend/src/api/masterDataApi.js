import apiClient from './client';

export const academicYearsApi = {
  getAll: (activeOnly) => apiClient.get('/academic-years', { params: { activeOnly } }),
  getById: (id) => apiClient.get(`/academic-years/${id}`),
  create: (data) => apiClient.post('/academic-years', data),
  update: (id, data) => apiClient.put(`/academic-years/${id}`, data),
  toggleStatus: (id, active) => apiClient.patch(`/academic-years/${id}/status`, null, { params: { active } }),
  delete: (id) => apiClient.delete(`/academic-years/${id}`),
};

export const schoolGradesApi = {
  getAll: (activeOnly) => apiClient.get('/school-grades', { params: { activeOnly } }),
  getById: (id) => apiClient.get(`/school-grades/${id}`),
  create: (data) => apiClient.post('/school-grades', data),
  update: (id, data) => apiClient.put(`/school-grades/${id}`, data),
  toggleStatus: (id, active) => apiClient.patch(`/school-grades/${id}/status`, null, { params: { active } }),
  delete: (id) => apiClient.delete(`/school-grades/${id}`),
};

export const englishLevelsApi = {
  getAll: (activeOnly) => apiClient.get('/english-levels', { params: { activeOnly } }),
  getById: (id) => apiClient.get(`/english-levels/${id}`),
  create: (data) => apiClient.post('/english-levels', data),
  update: (id, data) => apiClient.put(`/english-levels/${id}`, data),
  toggleStatus: (id, active) => apiClient.patch(`/english-levels/${id}/status`, null, { params: { active } }),
  delete: (id) => apiClient.delete(`/english-levels/${id}`),
};

export const classGroupsApi = {
  getAll: (filters = {}) => apiClient.get('/class-groups', { params: filters }),
  getById: (id) => apiClient.get(`/class-groups/${id}`),
  create: (data) => apiClient.post('/class-groups', data),
  update: (id, data) => apiClient.put(`/class-groups/${id}`, data),
  toggleStatus: (id, active) => apiClient.patch(`/class-groups/${id}/status`, null, { params: { active } }),
  delete: (id) => apiClient.delete(`/class-groups/${id}`),
};
