import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Upload, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const EditProductModal = ({ product, onClose, onSave }) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        ...product,
        existingImages: product.imagesUrl || [],
        newImages: []
    });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }, []);

    const handleFiles = (files) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    newImages: [...prev.newImages, {
                        file,
                        preview: reader.result,
                        id: Date.now() + Math.random()
                    }]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index, isExisting = false) => {
        setFormData(prev => {
            if (isExisting) {
                const newExistingImages = [...prev.existingImages];
                newExistingImages.splice(index, 1);
                return { ...prev, existingImages: newExistingImages };
            } else {
                const newImages = [...prev.newImages];
                newImages.splice(index, 1);
                return { ...prev, newImages };
            }
        });
    };

    // Similar carousel logic as NewProductModal
    // ...add the carousel navigation functions here...

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className={`rounded-xl p-6 w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold dark:text-gray-100">Edit Product</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image upload section - similar to NewProductModal */}
                    {/* ...add image handling JSX here... */}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                                Description
                            </label>
                            <textarea
                                className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                                    Category *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                                    Vendor
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={formData.vendor}
                                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                                    Stock *
                                </label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-2 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin">⭮</span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditProductModal;