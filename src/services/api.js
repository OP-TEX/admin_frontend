import axios from 'axios';
import { refreshAuthTokens } from '../endpoints/endpoints';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId');
        
        // Use the refreshAuthTokens function from endpoints.js
        const tokens = await refreshAuthTokens(userId, refreshToken);
        
        // Update tokens in localStorage
        localStorage.setItem('token', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        // Update the authorization header and retry
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(originalRequest);
      } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  getAllUsers: () => api.get('/admin/all-users'),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export const orderApi = {
  getAllOrders: () => api.get('/orders'),
  getOrderStats: () => api.get('/orders/stats'),
  getOrdersByStatus: (status) => api.get(`/orders/status/${status}`),
  assignDelivery: (orderId, deliveryId) => api.put('/orders/assign', { orderId, deliveryId }),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}`, { status }),
};

export default api;
