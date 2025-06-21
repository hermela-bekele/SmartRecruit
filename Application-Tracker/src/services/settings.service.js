import api from './api';

const SETTINGS_API = '/settings';

class SettingsService {
  async updateProfile(profileData) {
    try {
      console.log('SettingsService: Updating profile with data:', profileData);
      console.log('SettingsService: Making request to:', `${SETTINGS_API}/profile`);
      const response = await api.put(`${SETTINGS_API}/profile`, profileData);
      console.log('SettingsService: Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('SettingsService: Profile update error:', error);
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

  async verify2FA(code) {
    try {
      const response = await api.post(`${SETTINGS_API}/2fa/verify`, { code });
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

  async getSettings() {
    try {
      const response = await api.get(`${SETTINGS_API}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new SettingsService(); 