const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  return { Authorization: `Bearer ${token}` };
};

export { getAuthHeader }; 