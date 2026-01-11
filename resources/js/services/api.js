import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register: async (data) => {
        const response = await api.post('/register', data);
        return response.data;
    },
    login: async (data) => {
        const response = await api.post('/login', data);
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/logout');
        return response.data;
    },
    getUser: async () => {
        const response = await api.get('/user');
        return response.data;
    },
};

export const postService = {
    getAll: async () => {
        const response = await api.get('/posts');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/posts', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/posts/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    },
};

export default api;
