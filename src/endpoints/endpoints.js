const BASE_URL = import.meta.env.VITE_API_URL || '/api';  // Remove http://localhost:3000 since we'll use proxy

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
        updateUserRole:(id) => `${BASE_URL}/admin/users/${id}/role`,
        deleteUser: (id) => `${BASE_URL}/admin/users/${id}`,
    },
    orders: {
      all: `${BASE_URL}/orders`,
      stats: `${BASE_URL}/orders/stats`,
      byStatus: (status) => `${BASE_URL}/orders/status/${status}`,
      assign: `${BASE_URL}/orders/assign`,
      updateStatus: (orderId) => `${BASE_URL}/orders/${orderId}`,
    }
};


export const refreshAuthTokens = async (userId, refreshToken) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }
  
  try {
    // Use the endpoint from API_ENDPOINTS instead of hardcoding it
    const response = await fetch(API_ENDPOINTS.auth.refreshToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        refreshToken
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to refresh tokens');
    }
    
    const data = await response.json();
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    };
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

// export async function updateUserRole(route, options = {}) {
//     const url = `${BASE_URL}${route}`;
  
//     // Merge default headers with any provided in options
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...(options.headers || {}),
//       },
//       ...options,
//     };
  
//     const response = await fetch(url, config);
    
//     // Throw an error if the response code is not in the 200-299 range
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Error ${response.status}: ${errorText}`);
//     }
  
//     // Parse and return JSON
//     return response.json();
//   }