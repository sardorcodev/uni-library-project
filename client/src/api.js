import axios from 'axios';

const api = axios.create({
    // Agar Vercelda bo'lsa, o'sha yerdagi linkni oladi, bo'lmasa localhost
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', 
});

export default api;