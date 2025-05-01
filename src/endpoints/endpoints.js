const BASE_URL = '/api';  // Remove http://localhost:3000 since we'll use proxy

export const API_ENDPOINTS = {
    auth: {
        login: `${BASE_URL}/auth/login`,
        register: `${BASE_URL}/auth/register`,
        confirmEmail: `${BASE_URL}/auth/confirm-email`,
        sendConfirmation: `${BASE_URL}/auth/send-confirmation-email`,
        forgotPassword: `${BASE_URL}/auth/forgot-password`,
        resetPassword: `${BASE_URL}/auth/reset-password`,
        refreshToken: `${BASE_URL}/auth/refresh-token`,
    },
    user: {
        profile: `${BASE_URL}/user/profile`,
        cart: `${BASE_URL}/user/cart`,
        addToCart: `${BASE_URL}/user/cart/add`,
        removeFromCart: `${BASE_URL}/user/cart/remove`,
    },
    products: {
        all: `${BASE_URL}/products`,
        bestSellers: `${BASE_URL}/products/best-sellers`,
        featured: `${BASE_URL}/products/featured-products`,
    },
    admin: {
        addProduct: `${BASE_URL}/admin/products`,
        updateProduct: (id) => `${BASE_URL}/admin/products/${id}`,
        deleteProduct: (id) => `${BASE_URL}/admin/products/${id}`,
        getAllUsers: `${BASE_URL}/admin/all-users`,
    },
};
