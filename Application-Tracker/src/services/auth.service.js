import axios from 'axios';
import { isDemoMode } from '../utils/demoMode';
import demoStore from '../demo/demoStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AUTH_API = `${API_URL}/auth`;

class AuthService {
  async login(email, password) {
    try {
      if (isDemoMode()) {
        const response = await demoStore.login(email, password);
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('token', response.access_token);
        return response;
      }

      console.log('Attempting login with:', { email });
      const response = await axios.post(`${AUTH_API}/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.access_token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error in service:', error.response || error);
      throw this.handleError(error);
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  async requestPasswordReset(email) {
    try {
      if (isDemoMode()) {
        await demoStore.requestPasswordReset(email);
        return;
      }
      await axios.post(`${AUTH_API}/reset-password`, { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data.message || 'An error occurred';
      return new Error(message);
    } else if (error.message) {
      return new Error(error.message);
    } else if (error.request) {
      return new Error('No response from server');
    } else {
      return new Error('Error setting up request');
    }
  }
}

export default new AuthService();
