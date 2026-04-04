import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Attach JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (stored by redux-persist)
    const persistedRoot = localStorage.getItem('persist:root');
    if (persistedRoot) {
      try {
        const root = JSON.parse(persistedRoot);
        const auth = JSON.parse(root.auth || '{}');
        const token = auth.token;
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        // ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
