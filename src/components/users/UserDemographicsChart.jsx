import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#6366F1", "#8B5CF6"];

const UserDemographicsChart = () => {
    const { theme } = useTheme();
    const [userRoleData, setUserRoleData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserRoleData();
    }, []);

    const fetchUserRoleData = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllUsers();
            const users = response.data;
            
            // Count users by role
            const roleCountMap = {};
            users.forEach(user => {
                const role = user.role || 'unknown';
                roleCountMap[role] = (roleCountMap[role] || 0) + 1;
            });
            
            // Convert to format needed for pie chart
            const chartData = Object.entries(roleCountMap).map(([name, value]) => ({
                name: formatRoleName(name),
                value
            }));
            
            setUserRoleData(chartData);
        } catch (error) {
            console.error("Error fetching user role data:", error);
            // Fallback data if API call fails
            setUserRoleData([
                { name: "Customers", value: 0 },
                { name: "Customer Service", value: 0 },
                { name: "Delivery", value: 0 },
                { name: "Admin", value: 0 }
            ]);
        } finally {
            setLoading(false);
        }
    };
    
    // Helper to format role names for display
    const formatRoleName = (role) => {
        if (role === 'customer service') return 'Customer Service';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <motion.div
            className='dark:bg-gray-800 bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300 lg:col-span-2'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <h2 className='text-xl font-semibold dark:text-gray-100 text-gray-900 mb-4'>User Role Distribution</h2>
            
            {loading ? (
                <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={userRoleData}
                                cx='50%'
                                cy='50%'
                                outerRadius={100}
                                fill='#8884d8'
                                dataKey='value'
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {userRoleData.map((entry, index) => (
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
            )}
        </motion.div>
    );
};
export default UserDemographicsChart;