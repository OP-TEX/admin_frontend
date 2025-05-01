import { API_ENDPOINTS } from '../endpoints/endpoints';

export const addProduct = async (productData) => {
    try {
        const formData = new FormData();
        
        // Append product details
        formData.append('name', productData.name);
        formData.append('price', productData.price);
        formData.append('description', productData.description || '');
        formData.append('category', productData.category);
        formData.append('vendor', productData.vendor || 'Default Vendor');
        formData.append('stock', productData.stock);

        // Append images
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((image) => {
                formData.append('images', image.file);
            });
        }

        const response = await fetch(API_ENDPOINTS.admin.addProduct, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add product');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(API_ENDPOINTS.admin.deleteProduct(productId), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete product');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const formData = new FormData();
        
        // Append basic product details
        formData.append('name', productData.name);
        formData.append('price', productData.price);
        formData.append('description', productData.description || '');
        formData.append('category', productData.category);
        formData.append('vendor', productData.vendor || 'Default Vendor');
        formData.append('stock', productData.stock);

        // Append existing images as JSON string
        if (productData.existingImages?.length > 0) {
            formData.append('existingImages', JSON.stringify(productData.existingImages));
        }

        // Append new images if any
        if (productData.newImages?.length > 0) {
            productData.newImages.forEach((image) => {
                if (image.file) {
                    formData.append('images', image.file);
                }
            });
        }

        const response = await fetch(API_ENDPOINTS.admin.updateProduct(productId), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update product');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
