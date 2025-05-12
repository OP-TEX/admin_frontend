import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { orderApi, adminApi } from '../../services/api';
import toast from 'react-hot-toast';

const UpdateStatusModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(order.deliveryId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDelivery, setLoadingDelivery] = useState(true);

  // Available order statuses
  const statuses = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];

  // Fetch delivery persons
  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        setLoadingDelivery(true);
        const response = await adminApi.getAllUsers();
        const users = response.data;
        // Filter only delivery role users
        const deliveryUsers = users.filter(user => user.role === 'delivery');
        setDeliveryPersons(deliveryUsers);
      } catch (error) {
        console.error('Error fetching delivery persons:', error);
        toast.error('Failed to load delivery personnel');
      } finally {
        setLoadingDelivery(false);
      }
    };

    fetchDeliveryPersons();
  }, []);

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    try {
      // First update the order status
      await orderApi.updateOrderStatus(order.orderId, status);
      
      // If delivery person is changed, assign them
      if (selectedDeliveryId !== order.deliveryId) {
        await orderApi.assignDelivery(order.orderId, selectedDeliveryId);
      }
      
      toast.success('Order updated successfully');
      onStatusUpdate(); // Refresh the orders list
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(error.response?.data?.message || 'Failed to update order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Update Order
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order ID</h3>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{order.orderId}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {(status === 'Confirmed' || status === 'Out for Delivery') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Assign Delivery Person
                    </label>
                    {loadingDelivery ? (
                      <div className="flex justify-center py-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : deliveryPersons.length === 0 ? (
                      <div className="flex items-center space-x-2 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                        <AlertTriangle size={16} />
                        <span className="text-sm">No delivery personnel available</span>
                      </div>
                    ) : (
                      <select
                        value={selectedDeliveryId}
                        onChange={(e) => setSelectedDeliveryId(e.target.value)}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">-- Select Delivery Person --</option>
                        {deliveryPersons.map((person) => (
                          <option key={person._id} value={person._id}>
                            {person.firstName} {person.lastName} - {person.email}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {status === 'Cancelled' && (
                  <div className="flex items-center space-x-2 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                    <AlertTriangle size={16} />
                    <span className="text-sm">
                      Cancelling this order will return items to inventory.
                    </span>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleStatusUpdate}
                    disabled={isLoading || (status === 'Delivered' && !selectedDeliveryId)}
                  >
                    {isLoading ? 'Updating...' : 'Update Order'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpdateStatusModal;