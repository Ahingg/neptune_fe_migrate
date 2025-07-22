import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_API_URL; // Loaded from .env

const axiosClient = axios.create({
    baseURL,
    withCredentials: true, // IMPORTANT: Crucial for sending/receiving HTTP-only cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: You can add request or response interceptors here for logging, error handling, etc.
// For example, to log requests:
// axiosClient.interceptors.request.use(
//   (config) => {
//     console.log(`Sending ${config.method?.toUpperCase()} request to ${config.url}`);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default axiosClient;
