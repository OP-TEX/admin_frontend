import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const DeleteProductModal = ({ product, onClose, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
            >
                <div className="flex items-center justify-center mb-4 text-red-500">
                    <AlertTriangle size={48} />
                </div>
                
                <h3 className="text-lg font-semibold text-center mb-2 dark:text-gray-100">
                    Delete Product
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Are you sure you want to delete "{product.name}"? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg border dark:border-gray-600 
                            hover:bg-gray-50 dark:hover:bg-gray-700 
                            text-gray-700 dark:text-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white 
                            hover:bg-red-700 disabled:opacity-50 
                            flex items-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <span className="animate-spin">⭮</span>
                                Deleting...
                            </>
                        ) : (
                            'Delete Product'
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DeleteProductModal;