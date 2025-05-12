import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw } from "lucide-react";
import { adminApi } from "../../services/api";
import DeleteUserModal from "./DeleteUserModal";
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const UsersTable = () => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatingRole, setUpdatingRole] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    
    // Get current user from Redux store
    const { user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getAllUsers();
            setUserData(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = userData.filter(
            (user) => user.email.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!userId || !newRole) return;
        
        setUpdatingRole(userId);
        try {
            await adminApi.updateUserRole(userId, newRole);
            toast.success(`User role updated to ${newRole} successfully`);
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error updating user role:', error);
            toast.error(error.response?.data?.message || 'Failed to update user role');
        } finally {
            setUpdatingRole(null);
        }
    };

    const handleDeleteUser = async (userToDelete) => {
        setDeletingUser(userToDelete._id);
        try {
            await adminApi.deleteUser(userToDelete._id);
            toast.success('User deleted successfully');
            fetchUsers(); // Refresh the list
            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeletingUser(null);
        }
    };

    const roleOptions = ['customer', 'customer service', 'delivery', 'admin'];

    // Check if delete button should be shown for a user
    const canDeleteUser = (user) => {
        // Can't delete if:
        // 1. User is an admin
        // 2. User is the current logged-in user
        return user.role !== 'admin' && user._id !== currentUser?._id;
    };

    return (
        <>
            <motion.div
                className='bg-white dark:bg-gray-800 bg-opacity-100 dark:bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>Users</h2>
                    <div className='relative'>
                        <input
                            type='text'
                            placeholder='Search users...'
                            className='bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className='absolute left-3 top-2.5 text-gray-500 dark:text-gray-400' size={18} />
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <div className='max-h-[500px] overflow-y-auto'>
                        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                            <thead className='bg-white dark:bg-gray-800 sticky top-0'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                        User
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                        Role
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <div className='flex-shrink-0 h-10 w-10'>
                                                    <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                                                        {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='text-sm font-medium text-gray-800 dark:text-gray-100'>
                                                        {user.email}
                                                    </div>
                                                    <div className='text-sm text-gray-500'>
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center space-x-2'>
                                                {updatingRole === user._id ? (
                                                    <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
                                                ) : (
                                                    <select
                                                        className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed'
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                        disabled={user.role === 'admin' || user._id === currentUser?._id}
                                                        title={
                                                            user.role === 'admin' 
                                                                ? "Admin roles cannot be changed" 
                                                                : user._id === currentUser?._id
                                                                ? "You cannot change your own role"
                                                                : ""
                                                        }
                                                    >
                                                        {roleOptions.map(role => (
                                                            <option key={role} value={role}>
                                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </td>

                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300'>
                                            {canDeleteUser(user) && (
                                                <button 
                                                    className='text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed'
                                                    onClick={() => handleDeleteClick(user)}
                                                    disabled={deletingUser === user._id}
                                                >
                                                    {deletingUser === user._id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* Delete User Modal */}
            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                user={selectedUser}
                onDelete={handleDeleteUser}
            />
        </>
    );
};
export default UsersTable;