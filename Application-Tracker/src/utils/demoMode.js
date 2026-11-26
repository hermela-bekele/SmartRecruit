export const isDemoMode = () => {
  const flag = import.meta.env.VITE_DEMO_MODE;
  return flag === 'true' || flag === true;
};

export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@smartrecruit.demo', password: 'demo123', role: 'SUPER_ADMIN' },
  hr: { email: 'hr@smartrecruit.demo', password: 'demo123', role: 'HR_ADMIN' },
};
