import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AUTH_API = `${API_URL}/auth`;

class AuthService {
  async login(email, password) {
    try {
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
      await axios.post(`${AUTH_API}/reset-password`, { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error('Error setting up request');
    }
  }
}

export default new AuthService(); 