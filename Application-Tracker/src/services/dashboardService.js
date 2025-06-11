import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getDashboardStats = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    console.log('Making request to dashboard stats with token:', token.substring(0, 10) + '...');
    
    const response = await axios.get(`${API_URL}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('Dashboard stats response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    console.error('Error fetching dashboard stats:', error.response || error);
    throw error;
  }
}; 