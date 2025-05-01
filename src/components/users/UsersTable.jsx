import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

const UsersTable = () => {
	const [userData, setUserData] = useState([
		{ id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
		{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
		{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
		{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
		{ id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Moderator", status: "Active" },
		{ id: 10, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
		{ id: 20, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
		{ id: 30, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
		{ id: 40, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
		{ id: 50, name: "Charlie Wilson", email: "charlie@example.com", role: "Moderator", status: "Active" },
		{ id: 11, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
		{ id: 21, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
		{ id: 31, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
		{ id: 41, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
		{ id: 51, name: "Charlie Wilson", email: "charlie@example.com", role: "Moderator", status: "Active" },
	]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(userData);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = userData.filter(
			(user) => user.email.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	const handleEditClick = (user) => {
		setSelectedUser(user);
		setIsEditModalOpen(true);
	};

	const handleDeleteClick = (user) => {
		setSelectedUser(user);
		setIsDeleteModalOpen(true);
	};

	const handleCloseEditModal = () => {
		setIsEditModalOpen(false);
	};

	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
	};

	const handleSaveUser = (updatedUser) => {
		// Update the userData state
		setUserData(prevUserData =>
			prevUserData.map(user =>
				user.id === updatedUser.id ? updatedUser : user
			)
		);
		
		// Update the filteredUsers state
		setFilteredUsers(prevFilteredUsers =>
			prevFilteredUsers.map(user =>
				user.id === updatedUser.id ? updatedUser : user
			)
		);
	};

	const handleDeleteUser = (userToDelete) => {
		// Remove the user from userData state
		setUserData(prevUserData =>
			prevUserData.filter(user => user.id !== userToDelete.id)
		);
		
		// Remove the user from filteredUsers state
		setFilteredUsers(prevFilteredUsers =>
			prevFilteredUsers.filter(user => user.id !== userToDelete.id)
		);
	};

	return (
		<>
			<motion.div
				classname='bg-white dark:bg-gray-800 bg-opacity-100 dark:bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700'
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
										Email
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
										Role
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
										Status
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>

							<tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
								{filteredUsers.map((user) => (
									<motion.tr
										key={user.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
														{user.email.charAt(0)}
													</div>
												</div>
												<div className='ml-4'>
													<div className='text-sm font-medium text-gray-800 dark:text-gray-100'>
														{user.email}
													</div>
												</div>
											</div>
										</td>

										<td className='px-6 py-4 whitespace-nowrap'>
											<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'>
												{user.role}
											</span>
										</td>

										<td className='px-6 py-4 whitespace-nowrap'>
											<span
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													user.status === "Active"
														? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
														: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
												}`}
											>
												{user.status}
											</span>
										</td>

										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300'>
											<button 
												className='text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2'
												onClick={() => handleEditClick(user)}
											>
												Edit
											</button>
											<button 
												className='text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300'
												onClick={() => handleDeleteClick(user)}
											>
												Delete
											</button>
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</motion.div>

			{/* Edit User Modal */}
			<EditUserModal 
				isOpen={isEditModalOpen} 
				onClose={handleCloseEditModal} 
				user={selectedUser} 
				onSave={handleSaveUser} 
			/>

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
