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
  const response = await axios.patch(`${API_URL}/applications/${id}`, { status });
  return response.data;
};

export const deleteApplication = async (id) => {
  await axios.delete(`${API_URL}/applications/${id}`);
};