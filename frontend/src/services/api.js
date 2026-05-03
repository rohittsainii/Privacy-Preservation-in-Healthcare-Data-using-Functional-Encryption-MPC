import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Intercept to add auth token
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// --- Encryption ---
export const encryptPatientData = (data) => API.post('/encrypt', data);
export const uploadDataset = (formData) =>
  API.post('/encrypt/batch', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// --- Key Management ---
export const requestFunctionKey = (payload) => API.post('/request-key', payload);

// --- Compute ---
export const computeFunction = (payload) => API.post('/compute', payload);

// --- MPC ---
export const initiateMPC = (payload) => API.post('/mpc/initiate', payload);

// --- Audit ---
export const getAuditLogs = () => API.get('/audit');
export const getComputationResults = () => API.get('/compute/results');

// --- Stats (for dashboard) ---
export const getDashboardStats = () => API.get('/stats');

export default API;
