import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchApplications = async () => {
  const response = await axios.get(`${API_URL}/applications`);
  return response.data;
};

export const submitApplication = async (applicationData, resumeFile) => {
  const formData = new FormData();
  formData.append('name', applicationData.name);
  formData.append('email', applicationData.email);
  formData.append('position', applicationData.position);
  formData.append('company', applicationData.company);
  formData.append('coverLetter', applicationData.coverLetter || '');
  formData.append('phone', applicationData.phone || '');

  if (applicationData.skills) {
    formData.append('skills', JSON.stringify(applicationData.skills));
  }
  
  if (applicationData.timeline) {
    formData.append('timeline', JSON.stringify(applicationData.timeline));
  }
  
  if (resumeFile) {
    formData.append('resume', resumeFile);
  }

  const response = await axios.post(`${API_URL}/applications`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  try {
    console.log('Making PATCH request to:', `${API_URL}/applications/${id}`);
    console.log('Request payload:', { status, timeline: [{ date: new Date().toISOString(), status }] });
    
    const response = await axios.patch(`${API_URL}/applications/${id}`, { 
      status,
      timeline: [{
        date: new Date().toISOString(),
        status: status
      }]
    });
    
    console.log('Response from server:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw error;
  }
};

export const deleteApplication = async (id) => {
  await axios.delete(`${API_URL}/applications/${id}`);
};