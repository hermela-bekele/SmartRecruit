import axios from 'axios';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('Jobs Service initialized with API_URL:', API_URL);

// Create axios instance with auth header interceptor
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for CORS with credentials
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
api.interceptors.response.use((response) => {
  console.log('API Response:', {
    url: response.config.url,
    method: response.config.method,
    status: response.status,
    data: response.data
  });
  return response;
}, (error) => {
  console.error('API Error:', {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });
  return Promise.reject(error);
});

class JobsService {
  async getAllJobs(filters = {}) {
    try {
      console.log('Fetching all jobs with filters:', filters);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
      console.log('Fetched all jobs:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all jobs:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw this.handleError(error);
    }
  }

  async getPublicJobs(filters = {}) {
    try {
      console.log('Fetching public jobs with filters:', filters);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/jobs/public${params.toString() ? `?${params.toString()}` : ''}`);
      console.log('Fetched public jobs:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching public jobs:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw this.handleError(error);
    }
  }

  async getJob(id) {
    try {
      console.log('Fetching job details for ID:', id);
      const response = await api.get(`/jobs/${id}`);
      console.log('Fetched job details:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', {
        id,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw this.handleError(error);
    }
  }

  async getJobApplicants(jobId) {
    try {
      console.log('Fetching applicants for job ID:', jobId);
      const response = await api.get(`/jobs/${jobId}/applications`);
      console.log('Fetched job applicants:', response.data);
      
      // Ensure we return an array even if the response is empty
      const applicants = Array.isArray(response.data) ? response.data : [];
      return applicants.map(applicant => ({
        ...applicant,
        appliedDate: applicant.appliedDate || new Date().toISOString(),
        status: applicant.status || 'Received',
        phone: applicant.phone || null,
        resumePath: applicant.resumePath || null
      }));
    } catch (error) {
      console.error('Error fetching job applicants:', {
        jobId,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw this.handleError(error);
    }
  }

  async createJob(jobData) {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateJob(id, jobData) {
    try {
      const response = await api.patch(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteJob(id) {
    try {
      await api.delete(`/jobs/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async closePosition(id) {
    try {
      const response = await api.patch(`/jobs/${id}/close`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || error.response.statusText || 'An error occurred';
      console.error('Server error response:', {
        status: error.response.status,
        data: error.response.data,
        message
      });
      return new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return new Error('No response from server - please check if the backend is running');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return new Error('Error setting up request');
    }
  }
}

export default new JobsService(); 