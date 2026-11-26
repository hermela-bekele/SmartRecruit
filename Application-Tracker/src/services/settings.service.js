import api from './api';
import { isDemoMode } from '../utils/demoMode';
import demoStore from '../demo/demoStore';
import authService from './auth.service';

const SETTINGS_API = '/settings';

const getCurrentUserId = () => {
  const current = authService.getCurrentUser();
  return current?.user?.id;
};

class SettingsService {
  async updateProfile(profileData) {
    try {
      if (isDemoMode()) {
        const userId = getCurrentUserId();
        const updated = await demoStore.updateProfile(userId, profileData);
        const current = authService.getCurrentUser();
        if (current?.user) {
          const next = {
            ...current,
            user: { ...current.user, ...updated },
          };
          localStorage.setItem('user', JSON.stringify(next));
        }
        return updated;
      }

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
      if (isDemoMode()) {
        return await demoStore.changePassword(getCurrentUserId(), passwordData);
      }
      const response = await api.put(`${SETTINGS_API}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateNotifications(notificationSettings) {
    try {
      if (isDemoMode()) {
        return await demoStore.updateNotifications(getCurrentUserId(), notificationSettings);
      }
      const response = await api.put(`${SETTINGS_API}/notifications`, notificationSettings);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async enable2FA() {
    try {
      if (isDemoMode()) {
        return await demoStore.enable2FA(getCurrentUserId());
      }
      const response = await api.post(`${SETTINGS_API}/2fa/enable`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async verify2FA(code) {
    try {
      if (isDemoMode()) {
        return await demoStore.verify2FA(getCurrentUserId(), code);
      }
      const response = await api.post(`${SETTINGS_API}/2fa/verify`, { code });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async disable2FA() {
    try {
      if (isDemoMode()) {
        return await demoStore.disable2FA(getCurrentUserId());
      }
      const response = await api.post(`${SETTINGS_API}/2fa/disable`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getSettings() {
    try {
      if (isDemoMode()) {
        return await demoStore.getSettings(getCurrentUserId());
      }
      const response = await api.get(`${SETTINGS_API}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new SettingsService();
