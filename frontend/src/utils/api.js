// Centralized API URL for frontend. Uses Vite env var when provided.
export const API_URL = import.meta.env.VITE_API_URL || 'https://bookit-backend-0au8.onrender.com';

export default API_URL;
