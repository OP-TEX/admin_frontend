import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const userDemographicsData = [
	{ name: "18-24", value: 20 },
	{ name: "25-34", value: 30 },
	{ name: "35-44", value: 25 },
	{ name: "45-54", value: 15 },
	{ name: "55+", value: 10 },
];

const UserDemographicsChart = () => {
	const { theme } = useTheme();
	return (
		<motion.div
			className='dark:bg-gray-800 bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300 lg:col-span-2'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
		>
			<h2 className='text-xl font-semibold dark:text-gray-100 text-gray-900 mb-4'>User Demographics</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={userDemographicsData}
							cx='50%'
							cy='50%'
							outerRadius={100}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{userDemographicsData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: theme === 'dark' ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.8)",
								borderColor: theme === 'dark' ? "#4B5563" : "#E5E7EB",
							}}
							itemStyle={{ color: theme === 'dark' ? "#E5E7EB" : "#1F2937" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default UserDemographicsChart;
