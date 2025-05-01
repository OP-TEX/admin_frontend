import { API_ENDPOINTS } from '../endpoints/endpoints';

export const getProducts = async (searchParams = {}) => {
    const queryString = Object.keys(searchParams)
        .filter(key => searchParams[key] !== undefined && searchParams[key] !== '')
        .map(key => `${key}=${encodeURIComponent(searchParams[key])}`)
        .join('&');

    const url = `${API_ENDPOINTS.products.all}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch products');
    }

    return await response.json();
};
