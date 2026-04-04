import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        // Admin token is stored in sessionStorage, user token in localStorage
        const token = sessionStorage.getItem('adminToken') || localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    login: (credentials) => api.post('/users/login', credentials),
    register: (data) => api.post('/users/register', data),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
};

export const productService = {
    getAll: (params) => api.get('/products', { params }),
    getBySlug: (slug) => api.get(`/products/${slug}`),
    getFeatured: () => api.get('/products/featured'),
    getRecommended: (slug, limit = 8) => api.get(`/products/${slug}/recommended`, { params: { limit } }),
    searchSuggestions: (q) => api.get('/products/search/suggestions', { params: { q } }),
    searchFull: (params) => api.get('/products/search/full', { params }),
};

export const reviewService = {
    getByProduct: (productId) => api.get(`/reviews/${productId}`),
    create: (formData) => api.post('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const categoryService = {
    getAll: () => api.get('/categories'),
    getBySlug: (slug) => api.get(`/categories/${slug}`),
};

export const orderService = {
    create: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/my'),
    track: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
};

export const adminService = {
    login: (credentials) => api.post('/admin/login', credentials),
    verify: () => api.get('/admin/verify'),
    getStats: () => api.get('/admin/dashboard'),
    getProducts: () => api.get('/admin/products'),
    getProduct: (id) => api.get(`/admin/products/${id}`),
    createProduct: (data) => api.post('/admin/products', data),
    updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),
    getOrders: () => api.get('/admin/orders'),
    updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
    deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
    getReviews: () => api.get('/admin/reviews'),
    deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
    getReturns: () => api.get('/admin/returns'),
    updateReturnStatus: (id, status) => api.put(`/admin/returns/${id}/status`, { status }),
    deleteReturn: (id) => api.delete(`/admin/returns/${id}`),
    getCategories: () => api.get('/admin/categories'),
    createCategory: (data) => api.post('/admin/categories', data),
    updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

export const settingsService = {
    getHeroSlides: () => api.get('/settings/hero-slides'),
    updateHeroSlides: (slides) => api.put('/settings/hero-slides', { slides }),
};

export default api;
