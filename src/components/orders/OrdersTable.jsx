import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, RefreshCw } from "lucide-react";
import { orderApi } from "../../services/api";
import toast from 'react-hot-toast';
import OrderDetailsModal from "./OrderDetailsModal";
import UpdateStatusModal from "./UpdateStatusModal";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getAllOrders();
            setOrders(response.data.orders);
            setFilteredOrders(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = orders.filter(
            (order) => order.orderId.toLowerCase().includes(term) || 
                      (order.userId && order.userId.toString().toLowerCase().includes(term))
        );
        setFilteredOrders(filtered);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleUpdateStatus = (order) => {
        setSelectedOrder(order);
        setIsStatusModalOpen(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const getStatusClassName = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Confirmed':
                return 'bg-yellow-100 text-yellow-800';
            case 'Out for Delivery':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <motion.div
                className='dark:bg-gray-800 bg-white bg-opacity-100 dark:bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-200'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-semibold dark:text-gray-100 text-gray-800'>
                        Order List {filteredOrders.length > 0 && 
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                                (Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'})
                            </span>
                        }
                    </h2>
                    <div className='flex items-center gap-4'>
                        <button 
                            className='text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300'
                            onClick={fetchOrders}
                            disabled={loading}
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <div className='relative'>
                            <input
                                type='text'
                                placeholder='Search orders...'
                                className='dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-800 dark:placeholder-gray-400 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <Search className='absolute left-3 top-2.5 dark:text-gray-400 text-gray-500' size={18} />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex justify-center items-center py-8 text-gray-500 dark:text-gray-400">
                        No orders found {searchTerm && `matching "${searchTerm}"`}
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <div className={`${filteredOrders.length > 7 ? "max-h-[500px] overflow-y-auto" : ""}`}>
                            <table className='min-w-full divide-y dark:divide-gray-700 divide-gray-200'>
                                <thead className='bg-white dark:bg-gray-800 sticky top-0 z-10'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider'>
                                            Order ID
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider'>
                                            Customer ID
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider'>
                                            Total
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider'>
                                            Status
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider'>
                                            Date
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className='divide-y dark:divide-gray-700 divide-gray-200 bg-white dark:bg-gray-800'>
                                    {filteredOrders.map((order) => (
                                        <motion.tr
                                            key={order._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-100 text-gray-800'>
                                                {order.orderId}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-100 text-gray-800'>
                                                {order.userId}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-100 text-gray-800'>
                                                ${order.totalPrice.toFixed(2)}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClassName(order.status)}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-gray-600'>
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-gray-600'>
                                                <div className="flex space-x-2">
                                                    <button 
                                                        className='dark:text-indigo-400 text-indigo-600 dark:hover:text-indigo-300 hover:text-indigo-500'
                                                        onClick={() => handleViewDetails(order)}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        className='dark:text-green-400 text-green-600 dark:hover:text-green-300 hover:text-green-500'
                                                        onClick={() => handleUpdateStatus(order)}
                                                    >
                                                        Update
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Order Details Modal */}
            {isDetailsModalOpen && selectedOrder && (
                <OrderDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    order={selectedOrder}
                />
            )}

            {/* Update Status Modal */}
            {isStatusModalOpen && selectedOrder && (
                <UpdateStatusModal
                    isOpen={isStatusModalOpen}
                    onClose={() => setIsStatusModalOpen(false)}
                    order={selectedOrder}
                    onStatusUpdate={fetchOrders}
                />
            )}
        </>
    );
};

export default OrdersTable;