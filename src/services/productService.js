import { API_ENDPOINTS } from '../endpoints/endpoints';

export const getProducts = async (searchParams = {}) => {
    const queryString = Object.keys(searchParams)
        .filter(key => searchParams[key] !== undefined && searchParams[key] !== '')
        .map(key => `${key}=${encodeURIComponent(searchParams[key])}`)
        .join('&');

    let url = `${API_ENDPOINTS.products.all}${queryString ? `?${queryString}` : ''}`;
    url = url + "?count=10000&page=1"
    // console.log('Fetching products from:', url);
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
