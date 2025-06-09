import axios from 'axios';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SETTINGS_API = `${API_URL}/settings`;

// Create axios instance with auth header interceptor
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = authService.getCurrentUser();
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

class SettingsService {
  async updateProfile(profileData) {
    try {
      const response = await api.put(`${SETTINGS_API}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await api.put(`${SETTINGS_API}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateNotifications(notificationSettings) {
    try {
      const response = await api.put(`${SETTINGS_API}/notifications`, notificationSettings);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async enable2FA() {
    try {
      const response = await api.post(`${SETTINGS_API}/2fa/enable`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async disable2FA() {
    try {
      const response = await api.post(`${SETTINGS_API}/2fa/disable`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async verify2FA(code) {
    try {
      const response = await api.post(`${SETTINGS_API}/2fa/verify`, { code });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getSettings() {
    try {
      const response = await api.get(SETTINGS_API);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new SettingsService(); 