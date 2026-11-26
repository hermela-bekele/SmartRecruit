import axios from 'axios';
import { isDemoMode } from '../utils/demoMode';
import demoStore from '../demo/demoStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('Jobs Service initialized with API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

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
      if (isDemoMode()) {
        return await demoStore.getAllJobs(filters);
      }

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
      if (isDemoMode()) {
        return await demoStore.getPublicJobs(filters);
      }

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
      if (isDemoMode()) {
        return await demoStore.getJob(id);
      }

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
      if (isDemoMode()) {
        const applicants = await demoStore.getJobApplicants(jobId);
        return applicants.map(applicant => ({
          ...applicant,
          appliedDate: applicant.appliedDate || new Date().toISOString(),
          status: applicant.status || 'Received',
          phone: applicant.phone || null,
          resumePath: applicant.resumePath || null
        }));
      }

      console.log('Fetching applicants for job ID:', jobId);
      const response = await api.get(`/jobs/${jobId}/applications`);
      console.log('Fetched job applicants:', response.data);
      
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
      if (isDemoMode()) {
        return await demoStore.createJob(jobData);
      }
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateJob(id, jobData) {
    try {
      if (isDemoMode()) {
        return await demoStore.updateJob(id, jobData);
      }
      const response = await api.patch(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteJob(id) {
    try {
      if (isDemoMode()) {
        await demoStore.deleteJob(id);
        return;
      }
      await api.delete(`/jobs/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async closePosition(id) {
    try {
      if (isDemoMode()) {
        return await demoStore.closePosition(id);
      }
      const response = await api.patch(`/jobs/${id}/close`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText || 'An error occurred';
      console.error('Server error response:', {
        status: error.response.status,
        data: error.response.data,
        message
      });
      return new Error(message);
    } else if (error.message) {
      return new Error(error.message);
    } else if (error.request) {
      console.error('No response received:', error.request);
      return new Error('No response from server - please check if the backend is running');
    } else {
      console.error('Request setup error:', error.message);
      return new Error('Error setting up request');
    }
  }
}

export default new JobsService();
