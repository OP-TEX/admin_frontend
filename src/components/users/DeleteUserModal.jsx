import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

const DeleteUserModal = ({ isOpen, onClose, user, onDelete }) => {
  const handleDelete = () => {
    onDelete(user);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fullscreen flex wrapper */}
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Delete User
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 p-4 mb-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                <AlertTriangle className="shrink-0" />
                <p>This action cannot be undone.</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete the user:
                </p>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={handleDelete}
                >
                  Delete User
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteUserModal;