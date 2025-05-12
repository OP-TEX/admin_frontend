import { UserCheck, UserPlus, UsersIcon, UserX, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { adminApi } from "../services/api";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserDemographicsChart from "../components/users/UserDemographicsChart";

const UsersPage = () => {
	const [stats, setStats] = useState({
		totalUsers: 0,
		customerService: 0,
		customers: 0,
		delivery: 0,
	});

	useEffect(() => {
		fetchUsersStats();
	}, []);

	const fetchUsersStats = async () => {
		try {
			const response = await adminApi.getAllUsers();
			// console.log(response);
			const users = response.data;
			console.log(users);
			setStats({
				totalUsers: users.length,
				customerService: users.filter((u) => u.role === "customer service").length,
				customers: users.filter((u) => u.role === "customer").length,
				delivery: users.filter((u) => u.role === "delivery").length,
			});
		} catch (error) {
			console.error("Error fetching users stats:", error);
		}
	};

	return (
		<div className='flex-1 overflow-auto relative z-10 dark:bg-gray-900 bg-light-primary'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Users'
						icon={UsersIcon}
						value={stats.totalUsers.toString()}
						color='#6366F1'
					/>
					<StatCard
						name='Customer service'
						icon={UserPlus}
						value={stats.customerService.toString()}
						color='#10B981'
					/>
					<StatCard
						name='Customers'
						icon={UserCheck}
						value={stats.customers.toString()}
						color='#F59E0B'
					/>
					<StatCard
						name='Delivery'
						icon={Truck}
						value={stats.delivery.toString()}
						color='#EF4444'
					/>
				</motion.div>

				<UsersTable />

				{/* USER CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserDemographicsChart />
				</div>
			</main>
		</div>
	);
};
export default UsersPage;
