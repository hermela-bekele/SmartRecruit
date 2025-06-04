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

export const updateApplicationStatus = async (id, status, emailContent, emailSubject) => {
  const response = await axios.patch(`${API_URL}/applications/${id}/status`, {
    status,
    emailContent,
    emailSubject,
  });
  return response.data;
};

export const downloadResume = async (id) => {
  try {
    console.log('Starting resume download for application:', id);
    
    const response = await axios.get(`${API_URL}/applications/${id}/resume`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/octet-stream'
      }
    });
    
    console.log('Response received:', {
      contentType: response.headers['content-type'],
      contentDisposition: response.headers['content-disposition'],
      dataType: response.data.type,
      dataSize: response.data.size
    });

    // Create a blob from the response data
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'application/octet-stream' 
    });

    // Get the filename from the Content-Disposition header or use a default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'resume.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    console.log('Preparing download with:', {
      filename,
      blobType: blob.type,
      blobSize: blob.size
    });

    // Create a temporary URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const downloadLink = document.createElement('a');
    downloadLink.style.display = 'none';
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    
    // Add to document, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);

    return true;
  } catch (error) {
    console.error('Error downloading resume:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    throw error;
  }
};

export const deleteApplication = async (id) => {
  await axios.delete(`${API_URL}/applications/${id}`);
};